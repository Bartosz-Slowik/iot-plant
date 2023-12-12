use axum::response::Html;
use axum::{
    extract::Json,
    http::{Request, StatusCode},
    response::IntoResponse,
    Router,
};
use reqwest::Client;
use select::document::Document;
use select::predicate::Text;
use select::predicate::{Attr, Class, Name};
use serde::Deserialize;
use std::fs;

#[derive(Deserialize)]
pub struct PlantSearch {
    query: String,
}
#[derive(Deserialize)]
pub struct UrlDetails {
    url: String,
}

pub async fn scrape_plant_info(plant_search: Json<PlantSearch>) -> impl IntoResponse {
    // Assuming the body.js content is available as a string
    let data = include_str!("body.txt").replace("#PLACEHOLDER#", &plant_search.query);
    fs::write("output.txt", &data).expect("Unable to write file");

    let client = Client::new();

    let response = client
        .post("https://pfaf.org/user/plantsearch.aspx")
        .header(
            "Content-Type",
            "multipart/form-data; boundary=---011000010111000001101001",
        )
        .header("cookie", "ASP.NET_SessionId=vdnbevmqve2naaelonu0fijl")
        .body(data)
        .send()
        .await;

    match response {
        Ok(res) => {
            if res.status().is_success() {
                let body = res.text().await.unwrap();

                let document = Document::from(body.as_str());

                let mut data = vec![];

                for row in document
                    .find(Attr("id", "ContentPlaceHolder1_gvresults"))
                    .next()
                    .unwrap()
                    .find(Name("tr"))
                {
                    let mut output = std::collections::HashMap::new();
                    let mut link = None;

                    for (i, cell) in row.find(Name("td")).enumerate() {
                        let header = document
                            .find(Attr("id", "ContentPlaceHolder1_gvresults"))
                            .next()
                            .unwrap()
                            .find(Name("th"))
                            .nth(i);
                        if let Some(header_elem) = header {
                            let header_text = header_elem.text().trim().to_string();
                            let cell_text = cell.text().trim().to_string();
                            output.insert(header_text, cell_text);

                            if let Some(a) = cell.find(Name("a")).next() {
                                link = a.attr("href");
                            }
                        }
                    }

                    if let Some(link_url) = link {
                        output.insert("link".to_string(), link_url.to_string());
                    }

                    if !output.is_empty() {
                        data.push(output);
                    }
                }

                Html(format!("{:?}", data)).into_response()
            } else {
                StatusCode::INTERNAL_SERVER_ERROR.into_response()
            }
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}
pub async fn scrape_plant_page(url_details: Json<UrlDetails>) -> impl IntoResponse {
    let client = Client::new();
    let base_url = "https://pfaf.org/user/";
    let full_url = format!("{}{}", base_url, url_details.url);

    let response = client.get(&full_url).send().await;

    match response {
        Ok(res) => {
            if res.status().is_success() {
                let body = res.text().await.unwrap();

                let document = Document::from(body.as_str());

                let mut data = vec![];

                // Find the second table element
                if let Some(table) = document
                    .find(Attr("id", "ContentPlaceHolder1_tblPlantImges"))
                    .next()
                {
                    if let Some(img) = table.find(Name("img")).next() {
                        if let Some(src) = img.attr("src") {
                            let full_url = format!("https://pfaf.org/{}", src);
                            data.push(full_url);
                        }
                    }
                }
                if let Some(span) = document
                    .find(Attr("id", "ContentPlaceHolder1_lblPhystatment"))
                    .next()
                {
                    data.push(span.html());
                }

                Html(format!("{:?}", data)).into_response()
            } else {
                StatusCode::INTERNAL_SERVER_ERROR.into_response()
            }
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}
