use axum::{
    extract::{Json, Query, State},
    http::{Method, StatusCode},
    response::{Response, Redirect, IntoResponse},
};
use chrono::{DateTime, Utc};
use serde_json;
use serde::{Serialize, Deserialize};
use sqlx::Row;

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

#[derive(Copy, Clone)]
pub enum ApiError {
    NotFound,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        use StatusCode as SC;

        match self {
            ApiError::NotFound => (SC::NOT_FOUND, "Not found.").into_response(),
        }
    }
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
    -> Result<AnyOf2<String, ApiError>, String>
{
    let mut conn = state.db.lock().await;

    use rand_core::OsRng;
    use argon2::{
        Argon2,
        password_hash::{ PasswordHasher, SaltString }
    };

    let argon2 = Argon2::default();
    let salt = SaltString::generate(&mut OsRng);
    let new_hash = argon2.hash_password(q.raw_password.as_bytes(), &salt).unwrap();

    let r = sqlx::query(
        "INSERT INTO Users(
            (username, name, password, nhood, phone)
        VALUES
            ($1, $2, $3, $4, $5);"
    )
        .bind(q.username)
        .bind(q.name)
        .bind(new_hash.serialize().as_bytes())
        .bind(q.nhood)
        .bind(q.phone)
        .execute(&mut *conn)
        .await
        .map_err(|err| err.to_string())?;

    if r.rows_affected() != 1 {
        Err("Internal database error".to_string())
    } else {
        Ok(AnyOf2::A("Success".to_string()))
    }
}
