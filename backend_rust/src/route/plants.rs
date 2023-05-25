use axum::{
    extract::{Path, State},
    Json,
};
use eyre::WrapErr;

use crate::{
    db::{self, devices},
    route::{Error, Result},
    Database,
};

#[axum::debug_handler]
pub async fn get_by_user_id(
    State(db): State<Database>,
    Path(id): Path<String>,
) -> Result<Json<Vec<db::devices::Data>>> {
    let plants = db
        .plants()
        .find_many(vec![db::plants::user_id::equals(id)])
        .exec()
        .await
        .wrap_err("Failed to get plants from the database")?;
    let mut returned_devices: Vec<db::devices::Data> = vec![];
    for plant in &plants {
        let device = db
            .devices()
            .find_unique(devices::device_id::equals(plant.device_id.clone().unwrap()))
            .exec()
            .await
            .wrap_err("Failed to get device from the database")?;
        let device = device.ok_or(Error::NotFound)?;
        returned_devices.push(device);
        
    }

    Ok(Json::from(returned_devices))
}
#[axum::debug_handler]
pub async fn get_by_device_id(
    State(db): State<Database>,
    Path((_user_id, id)): Path<(String, String)>,
) -> Result<Json<db::devices::Data>> {
    let device = db
        .devices()
        .find_unique(db::devices::device_id::equals(id))
        .exec()
        .await
        .wrap_err("Failed to get devices from the database")?;
    let device = device.ok_or(Error::NotFound)?;
    Ok(Json::from(device))
}

