use std::sync::Arc;
use argon2::{password_hash::SaltString, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{
    extract::State,
    http::{header, Response, StatusCode},
    response::IntoResponse,
    Extension, Json,
};
use axum_extra::extract::cookie::{Cookie, SameSite};
use jsonwebtoken::{encode, EncodingKey, Header};
use rand_core::OsRng;
use serde_json::json;

use crate::{
    model::{LoginUserSchema, RegisterUserSchema, TokenClaims},
    AppState,
    db::users::Data as User,   
    db,
};




pub async fn health_checker_handler() -> impl IntoResponse {
    const MESSAGE: &str = "JWT Authentication in Rust using Axum, Postgres, and Prisma";

    let json_response = serde_json::json!({
        "status": "success",
        "message": MESSAGE
    });

    Json(json_response)
}

pub async fn register_user_handler(
    State(data): State<Arc<AppState>>,
    Json(body): Json<RegisterUserSchema>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    
    let user_exists: Option<User> = data
            .prisma
            .users()
            .find_unique(db::users::email::equals(body.email.to_string().to_ascii_lowercase()))
            .exec()
            .await
            .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error lol": err.to_string() }))))?;

        if user_exists.is_some() {
        let error_response = serde_json::json!({
            "status": "fail",
            "message": "User with that email already exists",
        });

        return Err((StatusCode::CONFLICT, Json(error_response)));
    }

    let salt = SaltString::generate(&mut OsRng);
    let hashed_password = Argon2::default()
        .hash_password(body.password.as_bytes(), &salt)
        .map_err(|e| {
            let error_response = serde_json::json!({
                "status": "fail",
                "message": format!("Error while hashing password: {}", e),
            });
            (StatusCode::INTERNAL_SERVER_ERROR, Json(error_response))
        })
        .map(|hash| hash.to_string())?;

        let user = data
        .prisma
        .users()
        .create(body.email, hashed_password,vec![db::users::name::set(body.firstname), db::users::surname::set(body.surname)])
        .exec()
        .await
        .map_err(|e| {
            let error_response = serde_json::json!({
                "status": "fail",
                "message": format!("Database error: {}", e),
            });
            (StatusCode::INTERNAL_SERVER_ERROR, Json(error_response))
        })?;

    let user_response = serde_json::json!({"status": "success","data": serde_json::json!({
        "user": user
    })});

    Ok(Json(user_response))
}

pub async fn login_handler(
    State(data): State<Arc<AppState>>,
    Json(body): Json<LoginUserSchema>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    dbg!(&body);
    let user = data
        .prisma
        .users()
        .find_unique(db::users::email::equals(body.email.to_string().to_ascii_lowercase()))
        .exec()
        .await
        .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "db error": err.to_string() }))))?
        .ok_or_else(|| {
            let error_response = serde_json::json!({
                "status": "fail",
                "message": "Invalid email or password",
            });

            (StatusCode::BAD_REQUEST, Json(error_response))
        })?;

    let is_valid = match PasswordHash::new(&user.password) {
        Ok(parsed_hash) => Argon2::default()
            .verify_password(body.password.as_bytes(), &parsed_hash)
            .map_or(false, |_| true),
        Err(_) => false,
    };

    if !is_valid {
        let error_response = serde_json::json!({
            "status": "fail",
            "message": "Invalid email or password"
        });
        return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)));
    }

    let now = chrono::Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + chrono::Duration::minutes(60)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user.user_id,
        exp,
        iat,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(data.env.jwt_secret.as_ref()),
    )
    .unwrap();

    let cookie = Cookie::build("token", token.to_owned())
        .path("/")
        .max_age(time::Duration::hours(1))
        .same_site(SameSite::Lax)
        .http_only(true)
        .finish();

    let mut response = Response::new(json!({"status": "success", "token": token}).to_string());
    response
        .headers_mut()
        .insert(header::SET_COOKIE, cookie.to_string().parse().unwrap());
    Ok(response)
}

pub async fn logout_handler() -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let cookie = Cookie::build("token", "")
        .path("/")
        .max_age(time::Duration::hours(-1))
        .same_site(SameSite::Lax)
        .http_only(true)
        .finish();

    let mut response = Response::new(json!({"status": "success"}).to_string());
    response
        .headers_mut()
        .insert(header::SET_COOKIE, cookie.to_string().parse().unwrap());
    Ok(response)
}

pub async fn get_me_handler(
    Extension(user): Extension<User>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let json_response = serde_json::json!({
        "status":  "success",
        "data": serde_json::json!({
            "user": user
        })
    });

    Ok(Json(json_response))
}
