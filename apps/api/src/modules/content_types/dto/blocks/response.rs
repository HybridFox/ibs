use crate::modules::{
	content_types::models::{field::FieldModel, field_config::FieldConfigContent},
	core::models::hal::{HALLinkList, HALPage},
	content_components::{
		models::content_component::PopulatedContentComponent,
		dto::content_components::response::FieldDTO,
	},
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::{convert::From, collections::HashMap};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct BlockFieldsEmbeddedDTO {
	pub blocks: Vec<FieldDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct BlockFieldsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: BlockFieldsEmbeddedDTO,
}

impl
	From<(
		Vec<(
			FieldModel,
			PopulatedContentComponent,
			HashMap<String, FieldConfigContent>,
		)>,
		HALPage,
		Uuid,
		Uuid,
		Uuid,
	)> for BlockFieldsDTO
{
	fn from(
		(blocks, page, site_id, content_type_id, field_id): (
			Vec<(
				FieldModel,
				PopulatedContentComponent,
				HashMap<String, FieldConfigContent>,
			)>,
			HALPage,
			Uuid,
			Uuid,
			Uuid,
		),
	) -> Self {
		Self {
			_links: HALLinkList::from((
				format!(
					"/api/v1/sites/{}/content-types/{}/fields/{}/blocks",
					site_id, content_type_id, field_id
				),
				&page,
			)),
			_embedded: BlockFieldsEmbeddedDTO {
				blocks: blocks.into_iter().map(FieldDTO::from).collect(),
			},
			_page: page,
		}
	}
}
