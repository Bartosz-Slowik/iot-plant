use argon2::{password_hash::SaltString, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{
    extract::State,
    http::{header, Response, StatusCode},
    response::IntoResponse,
    Extension, Json,
    extract::Path,
};
use axum_extra::extract::cookie::{Cookie, SameSite};
use jsonwebtoken::{encode, EncodingKey, Header};
use rand_core::OsRng;
use serde_json::json;
use std::sync::Arc;

use crate::{
    db,
    db::users::Data as User,
    model::*,
    AppState,
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
        .find_unique(db::users::email::equals(
            body.email.to_string().to_ascii_lowercase(),
        ))
        .exec()
        .await
        .map_err(|err| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error lol": err.to_string() })),
            )
        })?;

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
        .create(
            body.email,
            hashed_password,
            vec![
                db::users::name::set(body.firstname),
                db::users::surname::set(body.surname),
            ],
        )
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
        .find_unique(db::users::email::equals(
            body.email.to_string().to_ascii_lowercase(),
        ))
        .exec()
        .await
        .map_err(|err| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "db error": err.to_string() })),
            )
        })?
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
        return Err((StatusCode::BAD_REQUEST, Json(error_response)));
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

pub async fn get_devices_handler(
    State(data): State<Arc<AppState>>,
    Extension(user): Extension<User>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let devices = data
        .prisma
        .devices()
        .find_many(vec![db::devices::user_id::equals(user.user_id)])
        .exec()
        .await
        .map_err(|err| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "db error": err.to_string() })),
            )
        })?;
    Ok(Json(devices))
}

pub async fn get_device_handler(
    State(data): State<Arc<AppState>>,
    Extension(user): Extension<User>,
    Path(device_id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let device = data
        .prisma
        .devices()
        .find_one(db::devices::device_id::equals(device_id).and(db::devices::user_id::equals(user.user_id)))
        .exec()
        .await
        .map_err(|err| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "db error": err.to_string() })),
            )
        })?;

    if let Some(device) = device {
        Ok(Json(device))
    } else {
        Err((
            StatusCode::NOT_FOUND,
            Json(json!({ "error": "device not found" })),
        ))
    }
}
pub async fn create_device_handler(
    State(data): State<Arc<AppState>>,
    Extension(user): Extension<User>,
    Json(new_device): Json<NewDeviceRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {

    let created_device = data
        .prisma
        .devices()
        .create(
            new_device.device_number.clone(),
            user.user_id.clone(),
            new_device.wetness,
            new_device.red,
            new_device.green,
            new_device.blue,
            new_device.name.clone(),
            new_device.trigger,
            new_device.description.clone(),
        )
        .await
        .map_err(|err| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "db error": err.to_string() })),
            )
        })?;

    Ok(Json(created_device))
}
pub async fn get_device_history_handler(
    State(data): State<Arc<AppState>>,
    Extension(user): Extension<User>,
    Path(device_id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let device = data
        .prisma
        .devices()
        .find_one(
            db::devices::device_id
                ::equals(device_id)
                .and(db::devices::user_id::equals(user.user_id)),
        )
        .await
        .map_err(|err| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "db error": err.to_string() })),
            )
        })?;

    if let Some(device) = device {
        let history = data
            .prisma
            .plant_history()
            .filter(db::plant_history::device_id::equals(device.id))
            .limit(100)
            .select()
            .map_err(|err| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "db error": err.to_string() })),
                )
            })
            .await?;

        Ok(Json(history))
    } else {
        Err((
            StatusCode::NOT_FOUND,
            Json(json!({ "error": "device not found" })),
        ))
    }
}
pub async fn add_device_history_handler(
    State(data): State<Arc<AppState>>,
    Extension(user): Extension<User>,
    Path(device_id): Path<i32>,
    Json(new_history): Json<NewPlantHistoryRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let device = data
        .prisma
        .devices()
        .find_one(db::devices::device_id::equals(device_id).and(db::devices::user_id::equals(user.user_id)))
        .await
        .map_err(|err| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "db error": err.to_string() })),
            )
        })?;

    if let Some(device) = device {
        let history = db::NewPlantHistory {
            device_id: device.id,
            temperature: new_history.temperature,
            humidity: new_history.humidity,
            light: new_history.light,
        };

        let created_history = data
            .prisma
            .plant_history()
            .create(&history)
            .await
            .map_err(|err| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "db error": err.to_string() })),
                )
            })?;

        Ok(Json(created_history))
    } else {
        Err((
            StatusCode::NOT_FOUND,
            Json(json!({ "error": "device not found" })),
        ))
    }
}






