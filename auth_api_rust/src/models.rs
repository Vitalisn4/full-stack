// src/models.rs
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema, PartialEq)]
#[serde(rename_all = "PascalCase")]
pub enum Role {
    User,
    Admin,
}

#[derive(Debug, Serialize, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct User {
    // MODIFICATION: Tell utoipa how to represent Uuid
    #[schema(value_type = String, format = "uuid", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef")]
    pub id: Uuid,
    pub email: String,
    pub role: Role,
    #[serde(skip_serializing)]
    pub password_hash: String,
    #[serde(skip_serializing)]
    pub refresh_token: Option<String>,
    #[serde(skip_serializing)]
    pub refresh_token_expires_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct RegisterRequest {
    #[schema(example = "user@example.com")]
    pub email: String,
    #[schema(example = "strongpassword123")]
    pub password: String,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct LoginRequest {
    #[schema(example = "user@example.com")]
    pub email: String,
    #[schema(example = "strongpassword123")]
    pub password: String,
}

#[derive(Debug, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct LoginResponse {
    pub access_token: String,
}

#[derive(Debug, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UserProfileResponse {
    // MODIFICATION: Tell utoipa how to represent Uuid here as well
    #[schema(value_type = String, format = "uuid", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef")]
    pub id: Uuid,
    pub email: String,
    pub role: Role,
}