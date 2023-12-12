mod config;
mod scrape;
mod handler;
mod jwt_auth;
mod model;
mod response;
mod router;

#[allow(warnings)]
mod db;

use db::PrismaClient;
use eyre::WrapErr;

use config::Config;
use std::sync::Arc;

use axum::http::{
    header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
    HeaderValue, Method,
};
use dotenv::dotenv;
use router::create_router;
use tower_http::cors::CorsLayer;

#[derive(Debug)]
pub struct AppState {
    prisma: PrismaClient,
    env: Config,
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let config = Config::init();

    let db = db::new_client()
        .await
        .wrap_err("Failed to create Prisma client")
        .unwrap();

    //allow all cors

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE]);

    let app = create_router(Arc::new(AppState {
        prisma: db,
        env: config.clone(),
    }))
    .layer(cors);

    println!("🚀 Server started successfully");
    axum::Server::bind(&"0.0.0.0:8000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
