// src/middleware.rs
use crate::{db::Db, errors::AppError, jwt, AppState};
use axum::{extract::{Request, State}, http::header, middleware::Next, response::Response};
use std::sync::Arc;

pub async fn auth(State(state): State<Arc<AppState>>, mut req: Request, next: Next) -> Result<Response, AppError> {
    let token = req.headers().get(header::AUTHORIZATION)
        .and_then(|auth_header| auth_header.to_str().ok())
        .and_then(|auth_value| auth_value.strip_prefix("Bearer "));
    
    let token = token.ok_or(AppError::Unauthorized)?;

    let claims = jwt::validate_token(token, &state.config.jwt_secret).map_err(|_| AppError::Unauthorized)?;
    
    let user = state.db_store.get_user_by_id(claims.sub).await?.ok_or(AppError::Unauthorized)?;
    
    req.extensions_mut().insert(user);
    Ok(next.run(req).await)
}