// src/config.rs
#[derive(Clone)]
pub struct Config {
    pub jwt_secret: String,
    pub jwt_refresh_secret: String,
}

impl Config {
    pub fn new() -> Self {
        Self {
            jwt_secret: "a-very-secure-secret-for-access-tokens-change-me".to_string(),
            jwt_refresh_secret: "another-very-secure-secret-for-refresh-tokens-change-me".to_string(),
        }
    }
}