use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateFieldOrderFieldDTO {
	pub id: Uuid,
	pub compartment_id: Option<Uuid>,
	pub sequence_number: i32,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateFieldOrderDTO {
	pub fields: Vec<UpdateFieldOrderFieldDTO>,
}
