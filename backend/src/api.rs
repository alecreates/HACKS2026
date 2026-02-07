use argon2::{
    Argon2,
    password_hash::{PasswordHashString, PasswordVerifier, PasswordHasher, SaltString}
};
use axum::{
    extract::{Json, Query, State},
    http::{Method, StatusCode},
    response::{Response, Redirect, IntoResponse},
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
}

impl std::fmt::Display for AuthError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            AuthError::WrongPassword => write!(f, "Wrong password"),
            AuthError::NoSuchUser => write!(f, "That user isn't registered"),
        }
    }
}

#[derive(Copy, Clone)]
pub enum ApiError {
    NotFound,
    Auth(AuthError),
    Forbidden,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        use StatusCode as SC;

        match self {
            ApiError::NotFound => (SC::NOT_FOUND, "Not found").into_response(),
            ApiError::Auth(e) => (SC::FORBIDDEN, e.to_string()).into_response(),
            ApiError::Forbidden => (SC::FORBIDDEN, "Forbidden").into_response(),
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
            (username, name, password, nhood, phone)
        VALUES
            ($1, $2, $3, $4, $5);"
    )
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
    struct P { password: String }
    let data = sqlx::query_as::<_, P>(
        "SELECT password FROM Users WHERE username = $1;"
    )
        .bind(&q.username)
        .fetch_one(&mut *conn)
        .await;

    let password_hash: PasswordHashString = match data {
        Ok(P { password }) => PasswordHashString::new(&password).unwrap(),
        Err(sqlx::Error::RowNotFound) => return Ok(AnyOf2::B(ApiError::Auth(AuthError::NoSuchUser))),
        Err(err) => return Err(e(err)),
    };

    if argon2.verify_password(q.password.as_bytes(), &password_hash.password_hash()).is_err() {
        return Ok(AnyOf2::B(ApiError::Auth(AuthError::WrongPassword)));
    }

    if let Err(er) = generate_jwt(1) {
        return Err(e(format!("jwt error: {:?}", er)));
    }

    let (claims, jwt) = generate_jwt(1).map_err(e)?;

    let r = sqlx::query(
        "INSERT INTO Sessions (uuid, aud, exp) VALUES ($1, $2, $3);"
    )
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
