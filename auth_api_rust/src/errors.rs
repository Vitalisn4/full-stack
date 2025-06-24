// src/errors.rs
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use std::fmt;

/// Custom application error enum
pub enum AppError {
    InternalServerError,
    BadRequest(String),
    Unauthorized,
    Forbidden,
    NotFound,
}

/// Implement `Debug` for better logging
impl fmt::Debug for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::InternalServerError => write!(f, "InternalServerError"),
            AppError::BadRequest(msg) => write!(f, "BadRequest({})", msg),
            AppError::Unauthorized => write!(f, "Unauthorized"),
            AppError::Forbidden => write!(f, "Forbidden"),
            AppError::NotFound => write!(f, "NotFound"),
        }
    }
}

/// Convert AppError to an HTTP response
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match &self {
            AppError::InternalServerError => {
                eprintln!("❌ Internal Server Error"); // Log error
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".to_string())
            }
            AppError::BadRequest(msg) => {
                eprintln!("⚠️ Bad Request: {}", msg); // Log error
                (StatusCode::BAD_REQUEST, msg.clone())
            }
            AppError::Unauthorized => {
                eprintln!("🔐 Unauthorized access attempt"); // Log error
                (StatusCode::UNAUTHORIZED, "Unauthorized or invalid token".to_string())
            }
            AppError::Forbidden => {
                eprintln!("🚫 Forbidden action"); // Log error
                (StatusCode::FORBIDDEN, "Forbidden".to_string())
            }
            AppError::NotFound => {
                eprintln!("🔍 Resource not found"); // Log error
                (StatusCode::NOT_FOUND, "Resource not found".to_string())
            }
        };

        (status, Json(json!({ "error": error_message }))).into_response()
    }
}
