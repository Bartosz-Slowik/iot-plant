use axum::{
    middleware,
    routing::{get, post},
    Router,
};

use axum::http::{
    header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
    HeaderValue, Method,
};

use db::PrismaClient;
use eyre::WrapErr;
use std::{net::SocketAddr, sync::Arc};
use tower_http::cors::{Any, CorsLayer};
use dotenv::dotenv;
use config::Config;

#[allow(warnings)]
mod db;
mod route;

mod config;
mod handler;
mod auth;


use crate::{
    handler::{
        get_me_handler, login_user_handler, logout_handler,
        register_user_handler,
    },
    auth::auth,
};


#[derive(Debug)]
pub struct AppState {
    db: PrismaClient,
    env: Config,
}

#[tokio::main]
async fn main() -> eyre::Result<()> {
    dotenv().ok();
    let config = Config::init();
    let db = db::new_client()
            .await
            .wrap_err("Failed to create Prisma client")?;
    let app = new_router(Arc::new(AppState {
        db: db,
        env: config.clone(),
    }));
    

    let address = SocketAddr::from(([127, 0, 0, 1], 3333));
    axum::Server::bind(&address)
        .serve(app.into_make_service())
        .await
        .wrap_err("Failed to run the server")
}

fn new_router(app_state:  Arc<AppState>) -> axum::Router {
    //let cors = CorsLayer::new().allow_origin(Any);

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::DELETE])
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE]);

    use route::*;
    axum::Router::new()
        .route("/health", get(health::get))
        .route("/api/auth/register", post(register_user_handler))
        .route("/api/auth/login", post(login_user_handler))
        .route(
            "/api/auth/logout",
            get(logout_handler)
                .route_layer(middleware::from_fn_with_state(app_state.clone(), auth)),
        )
        .route(
            "/api/myplants",
            get(get_me_handler)
                .route_layer(middleware::from_fn_with_state(app_state.clone(), auth)),
        )
        .layer(cors)
        .with_state(app_state)
}
