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
};
use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use serde_repr::{Serialize_repr, Deserialize_repr};
use sqlx::{Connection, SqliteConnection};

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

    let app = Router::new()
        .route("/api/register", post(api::register))
        // .route("/api/login", get(api::list_builds))
        // .route("/api/match", get(api::list_builds))
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind((Ipv4Addr::UNSPECIFIED, port)).await?;
    axum::serve(listener, app.into_make_service())
        .await?;

    Ok(())
}
