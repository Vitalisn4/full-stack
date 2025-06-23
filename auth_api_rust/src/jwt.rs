// src/jwt.rs
use crate::models::{Role, User};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub role: Role,
    pub exp: i64,
}

pub fn create_access_token(user: &User, secret: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let expiration = (Utc::now() + Duration::minutes(10)).timestamp();
    let claims = Claims { sub: user.id, role: user.role.clone(), exp: expiration };
    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref()))
}

pub fn create_refresh_token(user: &User, secret: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let expiration = (Utc::now() + Duration::days(7)).timestamp();
    let claims = Claims { sub: user.id, role: user.role.clone(), exp: expiration };
    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref()))
}

pub fn validate_token(token: &str, secret: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    decode::<Claims>(token, &DecodingKey::from_secret(secret.as_ref()), &Validation::default())
        .map(|data| data.claims)
}