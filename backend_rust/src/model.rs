use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub sub: String,
    pub iat: usize,
    pub exp: usize,
}

#[derive(Debug, Deserialize)]
pub struct RegisterUserSchema {
    pub email: String,
    pub password: String,
    pub firstname: Option<String>,
    pub surname: Option<String>,
}

pub struct NewDeviceRequest {
    pub device_number: String,
    pub user_id: String,
    pub wetness: Option<i32>,
    pub red: Option<i64>,
    pub green: Option<i64>,
    pub blue: Option<i64>,
    pub name: Option<String>,
    pub trigger: Option<i32>,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LoginUserSchema {
    pub email: String,
    pub password: String,
}
