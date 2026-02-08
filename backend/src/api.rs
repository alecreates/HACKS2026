use argon2::{
    Argon2,
    password_hash::{PasswordHashString, PasswordVerifier, PasswordHasher, SaltString}
};
use axum::{
    extract::{Json, Query, State, FromRequestParts},
    http::{request::Parts, Method, StatusCode},
    response::{Response, Redirect, IntoResponse},
    RequestPartsExt,
};
use axum_extra::{
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};
use chrono::{DateTime, Utc};
use serde_json;
use serde::{Serialize, Deserialize};
use sqlx::{FromRow, Row};

use log::{info, error};

use crate::{
    AppState,
};

pub enum AnyOf2<A, B> {
    A(A), B(B)
}

impl<A, B> IntoResponse for AnyOf2<A, B>
where
    A: IntoResponse,
    B: IntoResponse,
{
    fn into_response(self) -> Response {
        match self {
            AnyOf2::A(i) => i.into_response(),
            AnyOf2::B(i) => i.into_response(),
        }
    }
}

#[derive(Clone, Debug, Serialize)]
pub struct ServerError {
    inner: String,
}

impl From<anyhow::Error> for ServerError {
    fn from(e: anyhow::Error) -> Self {
        Self { inner: format!("{e:#}") }
    }
}

impl IntoResponse for ServerError {
    fn into_response(self) -> Response {
        error!("handled api error: {}", self.inner);
        (StatusCode::INTERNAL_SERVER_ERROR, self.inner).into_response()
    }
}

#[derive(Copy, Clone, Debug)]
pub enum AuthError {
    WrongPassword,
    NoSuchUser,
    InvalidToken,
    UnknownToken,
    ServerError,
}

impl std::fmt::Display for AuthError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            AuthError::WrongPassword => write!(f, "Wrong password"),
            AuthError::NoSuchUser => write!(f, "That user isn't registered"),
            AuthError::InvalidToken => write!(f, "Invalid or expired bearer token"),
            AuthError::UnknownToken => write!(f, "Valid but unknown token(?!)"),
            AuthError::ServerError => write!(f, "Server error when validating JWT"),
        }
    }
}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        (StatusCode::FORBIDDEN, self.to_string()).into_response()
    }
}

#[derive(Clone)]
pub enum ApiError {
    AlreadyArchived,
    Auth(AuthError),
    CannotMatchWithSelf,
    Internal(InternalError),
    NotFound,
    Unauthorized,
}

impl ApiError {
    pub fn internal(s: impl std::fmt::Display) -> ApiError {
        ApiError::Internal(InternalError(s.to_string()))
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        use StatusCode as SC;

        match self {
            ApiError::AlreadyArchived => (SC::BAD_REQUEST, "Already archived").into_response(),
            ApiError::Auth(e) => e.into_response(),
            ApiError::CannotMatchWithSelf => (SC::BAD_REQUEST, "Cannot match with self").into_response(),
            ApiError::Internal(e) => e.into_response(),
            ApiError::NotFound => (SC::NOT_FOUND, "Not found").into_response(),
            ApiError::Unauthorized => (SC::UNAUTHORIZED, "Unauthorized").into_response(),
        }
    }
}

#[derive(Clone)]
pub struct InternalError(String);

impl IntoResponse for InternalError {
    fn into_response(self) -> Response {
        (StatusCode::INTERNAL_SERVER_ERROR, self.0).into_response()
    }
}

fn e(s: impl std::fmt::Display) -> InternalError {
    InternalError(s.to_string())
}

#[derive(Clone, Debug, Deserialize)]
pub struct UserRegister {
    username: String,
    name: String,
    raw_password: String,
    nhood: u32,
    phone: String,
}

pub async fn register(
    State(state): State<AppState>,
    Json(q): Json<UserRegister>,
)
    -> Result<AnyOf2<String, ApiError>, InternalError>
{
    let mut conn = state.db.lock().await;

    use rand_core::OsRng;

    let argon2 = Argon2::default();
    let salt = SaltString::generate(&mut OsRng);
    let new_hash = argon2.hash_password(q.raw_password.as_bytes(), &salt).unwrap();

    let r = sqlx::query(
        "INSERT INTO Users
            (joined, username, name, password, nhood, phone)
        VALUES
            ($1, $2, $3, $4, $5, $6);"
    )
        .bind(chrono::Utc::now().timestamp())
        .bind(q.username)
        .bind(q.name)
        .bind(new_hash.serialize().as_str())
        .bind(q.nhood)
        .bind(q.phone)
        .execute(&mut *conn)
        .await
        .map_err(e)?;

    if r.rows_affected() != 1 {
        Err(e("Internal database error"))
    } else {
        Ok(AnyOf2::A("Success".to_string()))
    }
}

#[derive(Clone, Debug, Deserialize)]
pub struct UserLogin {
    username: String,
    password: String,
}

pub async fn login(
    State(state): State<AppState>,
    Json(q): Json<UserLogin>,
)
    -> Result<AnyOf2<String, ApiError>, InternalError>
{
    let mut conn = state.db.lock().await;
    let argon2 = Argon2::default();

    #[derive(FromRow)]
    struct P { id: i64, password: String }
    let data = sqlx::query_as::<_, P>(
        "SELECT id, password FROM Users WHERE username = $1;"
    )
        .bind(&q.username)
        .fetch_one(&mut *conn)
        .await;

    let (uid, password_hash) = match data {
        Ok(P { id, password }) => (id, PasswordHashString::new(&password).unwrap()),
        Err(sqlx::Error::RowNotFound) => return Ok(AnyOf2::B(ApiError::Auth(AuthError::NoSuchUser))),
        Err(err) => return Err(e(err)),
    };

    if argon2.verify_password(q.password.as_bytes(), &password_hash.password_hash()).is_err() {
        return Ok(AnyOf2::B(ApiError::Auth(AuthError::WrongPassword)));
    }

    let (claims, jwt) = generate_jwt(77).map_err(e)?;

    let r = sqlx::query(
        "INSERT INTO Sessions (user, uuid, aud, exp) VALUES ($1, $2, $3, $4);"
    )
        .bind(uid)
        .bind(&claims.uuid.as_bytes()[..])
        .bind(claims.aud)
        .bind(claims.exp.cast_signed())
        .execute(&mut *conn)
        .await
        .map_err(e)?;

    if r.rows_affected() != 1 {
        return Err(e("Internal database error"));
    }

    Ok(AnyOf2::A(jwt))
}

#[derive(Clone, Debug)]
pub struct Auth {
    user_id: i64,
    username: String,
    claims: ClientClaims,
}

impl FromRequestParts<AppState> for Auth {
    type Rejection = AuthError;

    async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
        let mut conn = state.db.lock().await;

        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
            .map_err(|_| AuthError::InvalidToken)?;

        let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::HS256);
        validation.set_audience(&["hacks26"]);
        validation.set_required_spec_claims(&["exp", "aud"]);

        let key = jsonwebtoken::DecodingKey::from_secret("wawa".as_bytes());

        let claims = match jsonwebtoken::decode::<ClientClaims>(bearer.token(), &key, &validation) {
            Ok(c) => c.claims,
            Err(_) => return Err(AuthError::InvalidToken),
        };

        let data = sqlx::query_as::<_, (i64, String)>(
            "SELECT u.id, u.username FROM Sessions JOIN Users u on u.id = user WHERE uuid = $1;"
        )
            .bind(&claims.uuid.as_bytes()[..])
            .fetch_one(&mut *conn).await;

        let (id, username) = match data {
            Ok(d) => d,
            Err(sqlx::Error::RowNotFound) => return Err(AuthError::UnknownToken),
            Err(e) => {
                log::error!("JWT Validation error: {:?}", e);
                return Err(AuthError::ServerError);
            },
        };

        Ok(Auth { claims, user_id: id, username })
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, FromRow)]
struct ClientClaims {
    uuid: uuid::Uuid,
    aud: String,
    exp: u64,
}

fn generate_jwt(expiry_hours: u64)
    -> Result<(ClientClaims, String), jsonwebtoken::errors::Error>
{
    let uuid = uuid::Uuid::new_v4();
    let expires = jsonwebtoken::get_current_timestamp() + (60 * 60 * expiry_hours);
    let claims = ClientClaims { uuid, aud: "hacks26".to_owned(), exp: expires };

    let jwt = jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &claims,
        &jsonwebtoken::EncodingKey::from_secret("wawa".as_bytes().into()),
    )?;

    Ok((claims, jwt))
}

#[derive(Clone, Debug, Deserialize)]
pub struct UserCreatePost {
    title: String,
    request: String,
    offer: String,
}

pub async fn create_post(
    State(state): State<AppState>,
    auth: Auth,
    Json(q): Json<UserCreatePost>,
)
    -> Result<AnyOf2<String, ApiError>, InternalError>
{
    let mut conn = state.db.lock().await;

    let pid: i64 = sqlx::query_scalar(
        "INSERT INTO Posts
          (timestamp, title, request, offer, author)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING id;"
    )
        .bind(chrono::Utc::now().timestamp())
        .bind(q.title)
        .bind(q.request)
        .bind(q.offer)
        .bind(auth.user_id)
        .fetch_one(&mut *conn).await
        .map_err(e)?;

    Ok(AnyOf2::A(pid.to_string()))
}

pub async fn feed(
    State(state): State<AppState>,
    _: Auth,
)
    -> Result<AnyOf2<String, ApiError>, InternalError>
{
    let mut conn = state.db.lock().await;

    #[derive(Serialize, FromRow)]
    struct Post {
        id: i64,
        author: String,
        username: String,
        timestamp: i64,
        title: String,
        request: String,
        offer: String,
        archived: bool,
    }

    let posts = sqlx::query_as::<_, Post>(
        "SELECT
          p.id, u.name as author, u.username, p.title, p.request, p.offer, p.timestamp, p.archived
        FROM Posts p
        JOIN Users u on author = u.id;"
    )
        .fetch_all(&mut *conn).await
        .map_err(e)?;

    Ok(AnyOf2::A(serde_json::to_string(&posts).unwrap()))
}

#[derive(Clone, Debug, Deserialize)]
pub struct UserMatch {
    pid: u64,
}

pub async fn make_match(
    State(state): State<AppState>,
    auth: Auth,
    Query(q): Query<UserMatch>,
)
    -> Result<String, ApiError>
{
    let mut conn = state.db.lock().await;

    #[derive(FromRow)]
    struct P { author: i64 }
    let data = sqlx::query_as::<_, P>(
        "SELECT author FROM Posts WHERE id = $1;"
    )
        .bind(q.pid.cast_signed())
        .fetch_one(&mut *conn)
        .await;

    let author = match data {
        Ok(P { author }) => author,
        Err(sqlx::Error::RowNotFound) => return Err(ApiError::NotFound),
        Err(err) => return Err(ApiError::internal(err)),
    };

    if author == auth.user_id {
        return Err(ApiError::CannotMatchWithSelf);
    }

    _ = sqlx::query(
        "INSERT INTO Matches (author, accepter, post) VALUES ($1, $2, $3);"
    )
        .bind(author)
        .bind(auth.user_id)
        .bind(q.pid.cast_signed())
        .execute(&mut *conn).await
        .map_err(ApiError::internal)?;

    Ok("Success".to_string())
}

#[derive(Clone, Debug, Deserialize)]
pub struct UserArchivePost {
    pid: u64,
}

pub async fn archive_post(
    State(state): State<AppState>,
    auth: Auth,
    Query(q): Query<UserArchivePost>,
)
    -> Result<String, ApiError>
{
    let mut conn = state.db.lock().await;

    // Check if the post is already archived, and check ownership.
    {
        #[derive(FromRow)]
        struct P { author: i64, archived: bool }
        let data = sqlx::query_as::<_, P>(
            "SELECT author, archived FROM Posts WHERE id = $1;"
        )
            .bind(q.pid.cast_signed())
            .fetch_one(&mut *conn)
            .await;

        match data {
            Ok(P { archived, .. }) if archived => Err(ApiError::AlreadyArchived),
            Ok(P { author, .. }) if author != auth.user_id => Err(ApiError::Unauthorized),
            Err(sqlx::Error::RowNotFound) => Err(ApiError::NotFound),
            Err(err) => Err(ApiError::internal(err)),
            _ => Ok(()),
        }?
    }

    _ = sqlx::query(
        "UPDATE Posts SET archived = 1 WHERE id = $1;"
    )
        .bind(q.pid.cast_signed())
        .execute(&mut *conn).await
        .map_err(ApiError::internal)?;

    Ok("Success".to_string())
}

pub async fn fetch_responses(
    State(state): State<AppState>,
    auth: Auth,
)
    -> Result<String, ApiError>
{
    let mut conn = state.db.lock().await;

    #[derive(Serialize, FromRow)]
    struct Item {
        responder_id: i64,
        responder_username: String,
        responder_name: String,
        responder_phone: String,

        post_id: i64,
        post_title: String,
        post_request: String,
        post_offer: String,
        post_timestamp: i64,
        post_archived: bool,
    }

    let items = sqlx::query_as::<_, Item>(
        "SELECT
          u.id as responder_id,
          u.name as responder_name,
          u.username as responder_username,
          u.phone as responder_phone,
          p.id as post_id,
          p.title as post_title,
          p.request as post_request,
          p.offer as post_offer,
          p.timestamp as post_timestamp,
          p.archived as post_archived
        FROM Matches m
        JOIN Users u on m.accepter = u.id
        JOIN Posts p on m.post = p.id
        WHERE m.author = $1 AND m.accepter IS NOT NULL;"
    )
        .bind(auth.user_id)
        .fetch_all(&mut *conn).await
        .map_err(ApiError::internal)?;

    Ok(serde_json::to_string(&items).unwrap())
}

pub async fn user_info(
    State(state): State<AppState>,
    auth: Auth,
)
    -> Result<String, ApiError>
{
    let mut conn = state.db.lock().await;

    #[derive(Serialize, FromRow)]
    struct BasicInfo {
        uid: i64,
        joined: i64,
        username: String,
        name: String,
        phone: String,
    }

    let basic = sqlx::query_as::<_, BasicInfo>(
        "SELECT id as uid, joined, username, name, phone FROM Users WHERE id = $1;"
    )
        .bind(auth.user_id)
        .fetch_one(&mut *conn).await
        .map_err(ApiError::internal)?;

    // Neighbors helped: number of neighbors (not posts) that were matched with and then archived
    let neighbors_helped = sqlx::query_scalar(
        "SELECT COUNT(DISTINCT m.author) FROM Matches m JOIN Posts p on m.post = p.id
        WHERE p.archived != 0 AND m.accepter = $1;"
    )
        .bind(auth.user_id)
        .fetch_one(&mut *conn).await
        .map_err(ApiError::internal)?;

    // Number of posts, archived and unarchived
    let requests_made = sqlx::query_scalar("SELECT COUNT(DISTINCT id) FROM Posts WHERE author = $1;")
        .bind(auth.user_id)
        .fetch_one(&mut *conn).await
        .map_err(ApiError::internal)?;

    // Number of posts matched with and then archived
    let favors_exchanged = sqlx::query_scalar(
        "SELECT COUNT(DISTINCT m.id) FROM Matches m JOIN Posts p on m.post = p.id
        WHERE p.archived != 0 AND m.accepter = $1;"
    )
        .bind(auth.user_id)
        .fetch_one(&mut *conn).await
        .map_err(ApiError::internal)?;

    #[derive(Serialize, FromRow)]
    struct Additional {
        neighbors_helped: u32,
        requests_made: u32,
        favors_exchanged: u32,
    }

    #[derive(Serialize, FromRow)]
    struct Info {
        basic: BasicInfo,
        additional: Additional,
    }

    Ok(serde_json::to_string(&Info {
        basic,
        additional: Additional { neighbors_helped, requests_made, favors_exchanged },
    }).unwrap())
}
