use crate::modules::{
	content::models::{content::Content, content_field::ContentField},
	core::models::hal::{HALLinkList, HALPage},
	content_components::enums::data_type::DataTypeEnum,
	sites::dto::languages::response::LanguageDTO,
	content_types::{
		models::content_type::ContentType, dto::content_types::response::ContentTypeDTO,
	},
	workflows::{
		dto::workflow_states::response::WorkflowStateDTO, models::workflow_state::WorkflowState,
	}, languages::models::language::Language,
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;
use uuid::Uuid;
use std::{convert::From, collections::HashMap};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentWithFieldsDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub workflow_state_id: Uuid,
	pub content_type_id: Uuid,
	pub translation_id: Uuid,
	pub published: bool,
	pub deleted: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	pub fields: HashMap<String, Option<Value>>,
	pub language: LanguageDTO,
	pub current_workflow_state: WorkflowStateDTO,
}

fn parse_array_fields(
	translation_id: Uuid,
	parent_id: Option<Uuid>,
	fields: Vec<ContentField>,
) -> Vec<Option<Value>> {
	let fields = fields
		.iter()
		.filter(|field| field.parent_id == parent_id)
		.map(|field| {
			match field.data_type {
				DataTypeEnum::TEXT
				| DataTypeEnum::NUMBER
				| DataTypeEnum::BOOLEAN
				| DataTypeEnum::REFERENCE => field.value.clone(),
				DataTypeEnum::ARRAY => {
					let sub_fields =
						parse_array_fields(translation_id, Some(field.id), fields.clone());

					// TODO: clean this up somehow 🤮
					let json = serde_json::to_string(&sub_fields).unwrap();
					serde_json::from_str(&json).unwrap()
				}
				DataTypeEnum::OBJECT => {
					let sub_fields =
						parse_object_fields(translation_id, Some(field.id), fields.clone());

					// TODO: clean this up somehow 🤮
					let json = serde_json::to_string(&sub_fields).unwrap();
					serde_json::from_str(&json).unwrap()
				}
			}
		})
		.collect();

	fields
}

fn parse_object_fields(
	translation_id: Uuid,
	parent_id: Option<Uuid>,
	fields: Vec<ContentField>,
) -> HashMap<String, Option<Value>> {
	dbg!(&fields);
	let fields = fields
		.iter()
		.filter(|field| field.parent_id == parent_id)
		.map(|field| {
			match field.data_type {
				DataTypeEnum::TEXT
				| DataTypeEnum::NUMBER
				| DataTypeEnum::BOOLEAN
				| DataTypeEnum::REFERENCE => (field.name.clone(), field.value.clone()),
				DataTypeEnum::ARRAY => {
					let sub_fields =
						parse_array_fields(translation_id, Some(field.id), fields.clone());

					// TODO: clean this up somehow 🤮
					let json = serde_json::to_string(&sub_fields).unwrap();
					(field.name.clone(), serde_json::from_str(&json).unwrap())
				}
				DataTypeEnum::OBJECT => {
					let sub_fields =
						parse_object_fields(translation_id, Some(field.id), fields.clone());

					// TODO: clean this up somehow 🤮
					let json = serde_json::to_string(&sub_fields).unwrap();
					(field.name.clone(), serde_json::from_str(&json).unwrap())
				}
			}
		})
		.collect::<HashMap<_, _>>();

	fields
}

impl From<(Content, Vec<ContentField>, Language, WorkflowState)> for ContentWithFieldsDTO {
	fn from(
		(content, fields, language, workflow_state): (
			Content,
			Vec<ContentField>,
			Language,
			WorkflowState,
		),
	) -> Self {
		Self {
			id: content.id,
			name: content.name,
			slug: content.slug,
			workflow_state_id: content.workflow_state_id,
			content_type_id: content.content_type_id,
			translation_id: content.translation_id,
			published: content.published,
			deleted: content.deleted,
			created_at: content.created_at,
			updated_at: content.updated_at,
			fields: parse_object_fields(content.translation_id, None, fields),
			language: LanguageDTO::from(language),
			current_workflow_state: WorkflowStateDTO::from(workflow_state),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentDefaultValuesDTO {
	pub fields: HashMap<String, Option<Value>>,
}

impl From<(Uuid, Vec<ContentField>)> for ContentDefaultValuesDTO {
	fn from((translation_id, fields): (Uuid, Vec<ContentField>)) -> Self {
		Self {
			fields: parse_object_fields(translation_id, None, fields),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub workflow_state_id: Uuid,
	pub content_type_id: Uuid,
	pub translation_id: Uuid,
	pub published: bool,
	pub deleted: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	pub language: LanguageDTO,
	pub content_type: ContentTypeDTO,
	pub current_workflow_state: WorkflowStateDTO,
}

impl From<(Content, Language, ContentType, WorkflowState)> for ContentDTO {
	fn from(
		(content, language, content_type, workflow_state): (
			Content,
			Language,
			ContentType,
			WorkflowState,
		),
	) -> Self {
		Self {
			id: content.id,
			name: content.name,
			slug: content.slug,
			workflow_state_id: content.workflow_state_id,
			translation_id: content.translation_id,
			content_type_id: content.content_type_id,
			published: content.published,
			deleted: content.deleted,
			created_at: content.created_at,
			updated_at: content.updated_at,
			language: LanguageDTO::from(language),
			content_type: ContentTypeDTO::from(content_type),
			current_workflow_state: WorkflowStateDTO::from(workflow_state),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentListEmbeddedDTO {
	pub content: Vec<ContentDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ContentListDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: ContentListEmbeddedDTO,
}

impl
	From<(
		Vec<(Content, Language, ContentType, WorkflowState)>,
		HALPage,
		Uuid,
	)> for ContentListDTO
{
	fn from(
		(content, page, site_id): (
			Vec<(Content, Language, ContentType, WorkflowState)>,
			HALPage,
			Uuid,
		),
	) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/content", site_id), &page)),
			_embedded: ContentListEmbeddedDTO {
				content: content.into_iter().map(ContentDTO::from).collect(),
			},
			_page: page,
		}
	}
}