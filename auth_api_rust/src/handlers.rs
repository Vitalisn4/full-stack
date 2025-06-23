// src/handlers.rs
use crate::{
    db::Db,
    errors::AppError,
    jwt,
    models::{LoginRequest, LoginResponse, RegisterRequest, User, UserProfileResponse},
    AppState,
};
use axum::{
    extract::State, http::StatusCode, response::IntoResponse, Extension, Json,
};
use axum_extra::extract::{
    cookie::{Cookie, SameSite},
    CookieJar,
};
use bcrypt::{hash, verify, DEFAULT_COST};
use std::sync::Arc;
use time;

// --- Helper function to build the refresh cookie ---
fn build_refresh_cookie(token: String) -> Cookie<'static> {
    Cookie::build(("jid", token))
        .path("/")
        .http_only(true)
        .same_site(SameSite::Lax)
        .build()
}

#[utoipa::path(
    post,
    path = "/api/auth/register",
    request_body = RegisterRequest,
    responses(
        (status = 201, description = "User created successfully", body = UserProfileResponse),
        (status = 400, description = "Invalid input or email already exists"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn register(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<RegisterRequest>,
) -> Result<(StatusCode, Json<UserProfileResponse>), AppError> {
    if payload.password.len() < 6 {
        return Err(AppError::BadRequest(
            "Password must be at least 6 characters long.".to_string(),
        ));
    }

    let hashed_password =
        hash(&payload.password, DEFAULT_COST).map_err(|_| AppError::InternalServerError)?;

    let new_user = state
        .db_store
        .create_user(&payload.email, &hashed_password)
        .await?;

    let user_response = UserProfileResponse {
        id: new_user.id,
        email: new_user.email,
        role: new_user.role,
    };

    Ok((StatusCode::CREATED, Json(user_response)))
}

#[utoipa::path(
    post,
    path = "/api/auth/login",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "Login successful", body = LoginResponse),
        (status = 401, description = "Invalid credentials"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn login(
    State(state): State<Arc<AppState>>,
    jar: CookieJar,
    Json(payload): Json<LoginRequest>,
) -> Result<(CookieJar, Json<LoginResponse>), AppError> {
    let user = state
        .db_store
        .get_user_by_email(&payload.email)
        .await?
        .ok_or(AppError::Unauthorized)?;

    if !verify(&payload.password, &user.password_hash).unwrap_or(false) {
        return Err(AppError::Unauthorized);
    }

    let access_token = jwt::create_access_token(&user, &state.config.jwt_secret)
        .map_err(|_| AppError::InternalServerError)?;

    let refresh_token = jwt::create_refresh_token(&user, &state.config.jwt_refresh_secret)
        .map_err(|_| AppError::InternalServerError)?;

    state
        .db_store
        .save_refresh_token(user.id, &refresh_token)
        .await?;

    let cookie = build_refresh_cookie(refresh_token);

    Ok((jar.add(cookie), Json(LoginResponse { access_token })))
}

#[utoipa::path(
    post,
    path = "/api/auth/refresh",
    responses(
        (status = 200, description = "Token refreshed successfully", body = LoginResponse),
        (status = 401, description = "Invalid or missing refresh token"),
        (status = 500, description = "Internal server error")
    ),
    security(("cookieAuth" = []))
)]
pub async fn refresh(
    State(state): State<Arc<AppState>>,
    jar: CookieJar,
) -> Result<Json<LoginResponse>, AppError> {
    let refresh_token_str = jar
        .get("jid")
        .map(|cookie| cookie.value().to_string())
        .ok_or(AppError::Unauthorized)?;

    let claims = jwt::validate_token(&refresh_token_str, &state.config.jwt_refresh_secret)
        .map_err(|_| AppError::Unauthorized)?;

    let user = state
        .db_store
        .get_user_by_id(claims.sub)
        .await?
        .ok_or(AppError::Unauthorized)?;

    if user.refresh_token.as_deref() != Some(&refresh_token_str) {
        return Err(AppError::Unauthorized);
    }

    let access_token = jwt::create_access_token(&user, &state.config.jwt_secret)
        .map_err(|_| AppError::InternalServerError)?;

    Ok(Json(LoginResponse { access_token }))
}

#[utoipa::path(
    post,
    path = "/api/auth/logout",
    responses(
        (status = 200, description = "Logout successful"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearerAuth" = []))
)]
pub async fn logout(
    State(state): State<Arc<AppState>>,
    Extension(user): Extension<User>,
    jar: CookieJar,
) -> Result<(CookieJar, StatusCode), AppError> {
    state.db_store.clear_refresh_token(user.id).await?;

    let cookie = Cookie::build(("jid", ""))
        .path("/")
        .max_age(time::Duration::ZERO)
        .build();

    Ok((jar.add(cookie), StatusCode::OK))
}

#[utoipa::path(
    get,
    path = "/api/users/profile",
    responses(
        (status = 200, description = "User profile data", body = UserProfileResponse),
        (status = 401, description = "Unauthorized")
    ),
    security(("bearerAuth" = []))
)]
pub async fn profile(Extension(user): Extension<User>) -> impl IntoResponse {
    let user_response = UserProfileResponse {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    (StatusCode::OK, Json(user_response))
}