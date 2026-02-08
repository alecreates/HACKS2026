#![allow(unused_imports)]

mod api;

use std::net::Ipv4Addr;
use std::sync::Arc;
use tokio::sync::Mutex;

use anyhow::{Context, Result as AnyResult};
use axum::{
    extract::{Path, State, Request},
    body::Body,
    routing::{post, get}, Router,
    response::{IntoResponse},
    http::{header::{CONTENT_TYPE, AUTHORIZATION}, Method, HeaderValue},
};
use chrono::{DateTime, Utc};
use serde_repr::{Serialize_repr, Deserialize_repr};
use serde::{Serialize, Deserialize};
use sqlx::{Connection, SqliteConnection};
use tower_http::cors::{CorsLayer, Any};
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

#[derive(Debug, Clone)]
pub struct AppState {
    pub db: Arc<Mutex<SqliteConnection>>,
}

#[tokio::main]
async fn main() -> AnyResult<()> {
    let port = std::env::var("PORT")
        .unwrap_or("3000".to_string())
        .parse::<u16>()
        .unwrap();

    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .or_else(|_| EnvFilter::try_new("hacks26=info,tower_http=trace"))
                .unwrap(),
        )
        .init();

    let state = AppState {
        db: Arc::new(Mutex::new(
                SqliteConnection::connect("sqlite:main.sqlite3")
                    .await
                    .with_context(|| "Couldn't open database")?,
        )),
    };

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([CONTENT_TYPE, AUTHORIZATION]);

    let app = Router::new()
        .route("/register", post(api::register))
        .route("/login", post(api::login))
        .route("/create", post(api::create_post))
        .route("/feed", get(api::feed))
        .route("/match", get(api::make_match))
        .route("/responses", get(api::fetch_responses))
        .route("/rkyv", get(api::archive_post))
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind((Ipv4Addr::UNSPECIFIED, port)).await?;
    axum::serve(listener, app.into_make_service())
        .await?;

    Ok(())
}
