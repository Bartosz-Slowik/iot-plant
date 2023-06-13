use axum::routing::get;
use db::PrismaClient;
use eyre::WrapErr;
use std::{net::SocketAddr, sync::Arc};
use tower_http::cors::{Any, CorsLayer};

#[allow(warnings)]


type Database = Arc<PrismaClient>;

#[tokio::main]
async fn main() -> eyre::Result<()> {
    let db = Arc::new(
        db::new_client()
            .await
            .wrap_err("Failed to create Prisma client")?,
    );
    
    let router = new_router(db);

    let address = SocketAddr::from(([127, 0, 0, 1], 3333));
    axum::Server::bind(&address)
        .serve(router.into_make_service())
        .await
        .wrap_err("Failed to run the server")
}

fn new_router(db: Database) -> axum::Router {
    let cors = CorsLayer::new().allow_origin(Any);
    use route::*;
    axum::Router::new()
        .route("/health", get(health::get))
        .route("/user", get(user::get).post(user::post))
        .route(
            "/user/:user_id",
            get(user::get_by_id)
        )
        .route("/plants/:user_id", get(plants::get_by_user_id))
        .route("/plants/:user_id/:device_id", get(plants::get_by_device_id))
        .layer(cors)
        .with_state(db)
}
