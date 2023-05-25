use axum::http::StatusCode;

#[axum::debug_handler]
pub async fn get() -> StatusCode {
    StatusCode::OK
}
