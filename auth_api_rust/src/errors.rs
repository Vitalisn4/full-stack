// src/errors.rs
use axum::{http::StatusCode, response::{IntoResponse, Response}, Json};
use serde_json::json;

pub enum AppError {
    InternalServerError,
    BadRequest(String),
    Unauthorized,
    Forbidden,
    NotFound,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::InternalServerError => (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".to_string()),
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::Unauthorized => (StatusCode::UNAUTHORIZED, "Unauthorized or invalid token".to_string()),
            AppError::Forbidden => (StatusCode::FORBIDDEN, "Forbidden".to_string()),
            AppError::NotFound => (StatusCode::NOT_FOUND, "Resource not found".to_string()),
        };
        (status, Json(json!({ "error": error_message }))).into_response()
    }
}