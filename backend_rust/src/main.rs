use axum::routing::get;
use db::PrismaClient;
use eyre::WrapErr;
use std::{net::SocketAddr, sync::Arc};

#[allow(warnings)]
mod db;
mod route;

type Database = Arc<PrismaClient>;

#[tokio::main]
async fn main() -> eyre::Result<()> {
    let db = Arc::new(
        db::new_client()
            .await
            .wrap_err("Failed to create Prisma client")?,
    );

    let router = new_router(db);

    let address = SocketAddr::from(([0, 0, 0, 0], 3000));
    axum::Server::bind(&address)
        .serve(router.into_make_service())
        .await
        .wrap_err("Failed to run the server")
}

fn new_router(db: Database) -> axum::Router {
    use route::*;
    axum::Router::new()
        .route("/health", get(health::get))
        .route("/user", get(user::get).post(user::post))
        .route(
            "/user/:id",
            get(user::get_by_id).put(user::put),
        )
        .with_state(db)
}
