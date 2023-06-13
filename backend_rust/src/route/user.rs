use axum::{
    extract::{Path, State},
    Json,
};
use eyre::WrapErr;

use crate::{
    db,
    route::{Error, Result},
};


#[derive(serde::Deserialize)]
pub struct NewUser {
    email: String,
    password: String,
    role_id: String,
    name: Option<String>,
    surname: Option<String>,
}

#[axum::debug_handler]
pub async fn get(
    State(db): State<AppState>,
) -> Result<Json<Vec<db::users::Data>>> {
    let users = db
        .users()
        .find_many(vec![])
        .exec()
        .await
        .wrap_err("Failed to get users from the db")?;

    Ok(Json::from(users))
}

#[axum::debug_handler]
pub async fn get_by_id(
    State(db): State<AppState>,
    Path(id): Path<uuid::Uuid>,
) -> Result<Json<db::users::Data>> {
    let user = db
        .users()
        .find_unique(db::users::user_id::equals(id.to_string()))
        .exec()
        .await
        .wrap_err("Failed to get user from the db")?;
    let user = user.ok_or(Error::NotFound)?;

    Ok(Json::from(user))
}
#[axum::debug_handler]
pub async fn user_exists_by_email(
    State(app_state): State<AppState>,
    Path(email): Path<String>,
) -> Result<Json<bool>> {
    let user = app_state
        .prisma
        .users()
        .find_unique(db::users::email::equals(email))
        .exec()
        .await
        .wrap_err("Failed to get user from the database")?;

    Ok(Json::from(user.is_some()))
}


#[axum::debug_handler]
pub async fn post(
    State(db): State<AppState>,
    Json(input): Json<NewUser>,
) -> Result<Json<db::users::Data>> {
    let user = db
        .users()
        .create(input.email, input.password, db::roles::UniqueWhereParam::RoleIdEquals(input.role_id), vec![db::users::name::set(input.name), db::users::surname::set(input.surname)])
        .exec()
        .await
        .wrap_err("Failed to insert new user into the AppState")?;

    Ok(Json::from(user))
}


