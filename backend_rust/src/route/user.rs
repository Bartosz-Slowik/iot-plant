use axum::{
    extract::{Path, State},
    Json,
};
use eyre::WrapErr;

use crate::{
    db,
    route::{Error, Result},
    Database,
};

#[derive(serde::Deserialize)]
pub struct NewUser {
    email: String,
    password: String,
    roles: String,
    name: Option<String>,
    surname: Option<String>,
}

#[derive(serde::Deserialize)]
pub struct UpdateUser {
    name: Option<String>,
    surname: Option<String>,
}

#[axum::debug_handler]
pub async fn get(
    State(db): State<Database>,
) -> Result<Json<Vec<db::users::Data>>> {
    let users = db
        .users()
        .find_many(vec![])
        .exec()
        .await
        .wrap_err("Failed to get users from the database")?;

    Ok(Json::from(users))
}

#[axum::debug_handler]
pub async fn get_by_id(
    State(db): State<Database>,
    Path(id): Path<uuid::Uuid>,
) -> Result<Json<db::users::Data>> {
    let user = db
        .users()
        .find_unique(db::users::user_id::equals(id.to_string()))
        .exec()
        .await
        .wrap_err("Failed to get user from the database")?;
    let user = user.ok_or(Error::NotFound)?;

    Ok(Json::from(user))
}


#[axum::debug_handler]
pub async fn post(
    State(db): State<Database>,
    Json(input): Json<NewUser>,
) -> Result<Json<db::users::Data>> {
    let user = db
        .users()
        .create(input.email, input.password, input.roles, vec![])
        .exec()
        .await
        .wrap_err("Failed to insert new user into the database")?;

    Ok(Json::from(user))
}


