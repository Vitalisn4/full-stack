// src/db/mem_db.rs
use super::Db;
use crate::{errors::AppError, models::{Role, User}};
use async_trait::async_trait;
use chrono::Utc;
use std::{collections::HashMap, sync::{Arc, RwLock}};
use uuid::Uuid;

pub struct InMemoryDb {
    users: Arc<RwLock<HashMap<Uuid, User>>>,
    email_to_id: Arc<RwLock<HashMap<String, Uuid>>>,
}

impl InMemoryDb {
    pub fn new() -> Self {
        Self {
            users: Arc::new(RwLock::new(HashMap::new())),
            email_to_id: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

#[async_trait]
impl Db for InMemoryDb {
    async fn create_user(&self, email: &str, password_hash: &str) -> Result<User, AppError> {
        let email_lowercase = email.to_lowercase();
        let mut email_map = self.email_to_id.write().map_err(|_| AppError::InternalServerError)?;
        if email_map.contains_key(&email_lowercase) {
            return Err(AppError::BadRequest("Email already exists.".to_string()));
        }

        let mut user_map = self.users.write().map_err(|_| AppError::InternalServerError)?;
        let new_user = User {
            id: Uuid::new_v4(),
            email: email_lowercase.clone(),
            password_hash: password_hash.to_string(),
            role: Role::User,
            refresh_token: None,
            refresh_token_expires_at: None,
        };

        email_map.insert(email_lowercase, new_user.id);
        user_map.insert(new_user.id, new_user.clone());
        Ok(new_user)
    }

    async fn get_user_by_email(&self, email: &str) -> Result<Option<User>, AppError> {
        let email_map = self.email_to_id.read().map_err(|_| AppError::InternalServerError)?;
        if let Some(user_id) = email_map.get(&email.to_lowercase()) {
            let user_map = self.users.read().map_err(|_| AppError::InternalServerError)?;
            Ok(user_map.get(user_id).cloned())
        } else { Ok(None) }
    }

    async fn get_user_by_id(&self, user_id: Uuid) -> Result<Option<User>, AppError> {
        let user_map = self.users.read().map_err(|_| AppError::InternalServerError)?;
        Ok(user_map.get(&user_id).cloned())
    }

    async fn save_refresh_token(&self, user_id: Uuid, token: &str) -> Result<(), AppError> {
        let mut user_map = self.users.write().map_err(|_| AppError::InternalServerError)?;
        if let Some(user) = user_map.get_mut(&user_id) {
            user.refresh_token = Some(token.to_string());
            user.refresh_token_expires_at = Some(Utc::now() + chrono::Duration::days(7));
            Ok(())
        } else { Err(AppError::NotFound) }
    }
    
    async fn clear_refresh_token(&self, user_id: Uuid) -> Result<(), AppError> {
        let mut user_map = self.users.write().map_err(|_| AppError::InternalServerError)?;
        if let Some(user) = user_map.get_mut(&user_id) {
            user.refresh_token = None;
            user.refresh_token_expires_at = None;
            Ok(())
        } else { Err(AppError::NotFound) }
    }
}