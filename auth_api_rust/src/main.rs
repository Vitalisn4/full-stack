// src/main.rs
mod config;
mod db;
mod errors;
mod handlers;
mod jwt;
mod middleware;
mod models;

use crate::{
    config::Config,
    db::{mem_db::InMemoryDb, Db},
};
use axum::{
    http::{HeaderName, HeaderValue, Method, StatusCode},
    middleware::from_fn_with_state,
    response::{Html, IntoResponse},
    routing::{get, post, get_service},
    Router,
};
use std::sync::Arc;
use tower_http::{cors::CorsLayer, services::ServeDir};
use utoipa::{
    openapi::security::SecurityScheme,
    Modify, OpenApi,
};
use utoipa_swagger_ui::SwaggerUi;

#[derive(Clone)]
pub struct AppState {
    db_store: Arc<dyn Db>,
    config: Config,
}

#[derive(OpenApi)]
#[openapi(
    paths(
        handlers::register,
        handlers::login,
        handlers::refresh,
        handlers::logout,
        handlers::profile,
    ),
    components(
        schemas(
            models::RegisterRequest,
            models::LoginRequest,
            models::LoginResponse,
            models::UserProfileResponse,
            models::Role,
            models::User,
        )
    ),
    modifiers(&SecurityAddon),
    tags(
        (name = "Auth API", description = "Rust + Axum Authentication API")
    )
)]
struct ApiDoc;

struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        let components = openapi.components.get_or_insert_with(Default::default);
        components.add_security_scheme(
            "bearerAuth",
            SecurityScheme::Http(utoipa::openapi::security::Http::new(
                utoipa::openapi::security::HttpAuthScheme::Bearer,
            )),
        );
        components.add_security_scheme(
            "cookieAuth",
            SecurityScheme::ApiKey(utoipa::openapi::security::ApiKey::Cookie(
                utoipa::openapi::security::ApiKeyValue::new("jid"),
            )),
        );
    }
}

fn api_routes(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/auth/register", post(handlers::register))
        .route("/auth/login", post(handlers::login))
        .route("/auth/refresh", post(handlers::refresh))
        .route(
            "/auth/logout",
            post(handlers::logout)
                .route_layer(from_fn_with_state(app_state.clone(), middleware::auth)),
        )
        .route(
            "/users/profile",
            get(handlers::profile)
                .route_layer(from_fn_with_state(app_state.clone(), middleware::auth)),
        )
        .with_state(app_state)
}

#[tokio::main]
async fn main() {
    let config = Config::new();
    let db_store = Arc::new(InMemoryDb::new());

    println!("✅ In-memory database initialized.");

    let app_state = Arc::new(AppState { db_store, config });

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::OPTIONS,
        ])
        .allow_headers([
            HeaderName::from_static("authorization"),
            HeaderName::from_static("content-type"),
        ])
        .allow_credentials(true);

    let app = Router::new()
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .nest("/api", api_routes(app_state))
        .route(
            "/*path",
            get_service(ServeDir::new("static")).handle_error(|_| async {
                Ok::<_, std::convert::Infallible>(
                    Html(tokio::fs::read_to_string("static/index.html").await.unwrap()).into_response()
                )
            }),
        )
        .layer(cors);
    
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("🚀 Server started successfully on http://localhost:30001");

    axum::serve(listener, app).await.unwrap();
}