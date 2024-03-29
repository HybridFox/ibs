use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateBlockFieldDTO {
	pub name: String,
	pub content_component_id: Uuid,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateBlockFieldDTO {
	pub name: Option<String>,
	pub slug: Option<String>,
	pub description: Option<String>,
	pub min: Option<i32>,
	pub max: Option<i32>,
	pub hidden: Option<bool>,
	pub multi_language: Option<bool>,
	pub sequence_number: Option<i32>,
	pub validation: Option<Value>,
	pub config: HashMap<String, Value>,
}
