
pub mod mem_db; // This makes the in-memory implementation accessible

use crate::{errors::AppError, models::User};
use async_trait::async_trait;
use uuid::Uuid;

// The "contract" our data stores must follow.
#[async_trait]
pub trait Db: Send + Sync {
    async fn create_user(&self, email: &str, password_hash: &str) -> Result<User, AppError>;
    async fn get_user_by_email(&self, email: &str) -> Result<Option<User>, AppError>;
    async fn get_user_by_id(&self, user_id: Uuid) -> Result<Option<User>, AppError>;
    async fn save_refresh_token(&self, user_id: Uuid, refresh_token: &str) -> Result<(), AppError>;
    async fn clear_refresh_token(&self, user_id: Uuid) -> Result<(), AppError>;
}