import { IAPIHALResponse, IAPIPagination, IPageParameters } from "../../types/paging.types";
import { ICompartment } from "../compartment";
import { IContentComponent } from "../content-component";

export enum FieldKeys {
	FIELD_GROUP = 'FIELD_GROUP',
	TEXT = 'TEXT',
	NUMBER = 'NUMBER',
	TEXTAREA = 'TEXTAREA',
	RICH_TEXT = 'RICH_TEXT',
	URL = 'URL',
	SELECT = 'SELECT',
	RADIO = 'RADIO',
	CHECKBOX = 'CHECKBOX',
	MAP = 'MAP',
	MEDIA = 'MEDIA',
	TOGGLE = 'TOGGLE',
	CONTENT_REFERENCE = 'CONTENT_REFERENCE',
	CONTENT_TYPES = 'CONTENT_TYPES',
	CONTENT_COMPONENTS = 'CONTENT_COMPONENTS',
	BLOCK = 'BLOCK',
	DATETIME = 'DATETIME',
}

export enum DataTypes {
	TEXT = 'TEXT',
	ARRAY = 'ARRAY',
	OBJECT = 'OBJECT',
	NUMBER = 'NUMBER',
	BOOLEAN = 'BOOLEAN',
	REFERENCE = 'REFERENCE',
	BLOCK = 'BLOCK',
}

export interface IContentType {
	id: string;
	name: string;
	slug: string;
	workflowId: string;
	kind: ContentTypeKinds;
	createdAt: string;
	updatedAt: string;
	fields: IField[];
	compartments: ICompartment[];
	contentOccurrences?: boolean;
}

export interface IField {
	id?: string;
	name: string;
	slug: string;
	min?: number;
	max?: number;
	multiLanguage?: boolean;
	contentComponent: IContentComponent;
	compartmentId?: string;
	sequenceNumber?: number;
	config?: Record<string, any>;
	blocks?: IField[];
	validation?: any;
}

export enum ContentTypeKinds {
	CONTENT = 'CONTENT',
	PAGE = 'PAGE',
	CONTENT_BLOCK = 'CONTENT_BLOCK',
}

export const CONTENT_TYPE_KINDS_TRANSLATIONS: Record<ContentTypeKinds, string> = {
	[ContentTypeKinds.CONTENT]: 'Content',
	[ContentTypeKinds.PAGE]: 'Page',
	[ContentTypeKinds.CONTENT_BLOCK]: 'Content Block',
};

export const CONTENT_TYPE_KINDS_PARAMETER_MAP: Record<string, ContentTypeKinds> = {
	content: ContentTypeKinds.CONTENT,
	pages: ContentTypeKinds.PAGE,
	'content-blocks': ContentTypeKinds.CONTENT_BLOCK,
}

export const CONTENT_TYPE_KINDS_OPTIONS: { value: string; label: string }[] = Object.keys(CONTENT_TYPE_KINDS_TRANSLATIONS).map(
	(key: string) => ({
		label: CONTENT_TYPE_KINDS_TRANSLATIONS[key as ContentTypeKinds],
		value: key,
	})
);

export interface IFetchContentTypesParameters extends IPageParameters {
	kind?: ContentTypeKinds
	inludeOccurrences?: boolean;
	siteId?: string;
}

export type IContentTypesResponse = IAPIHALResponse<'contentTypes', IContentType>

export interface IContentTypeStoreState {
	fetchContentTypes: (siteId: string, params?: IFetchContentTypesParameters) => Promise<void>;
	contentTypes: IContentType[];
	contentTypesPagination?: IAPIPagination;
	contentTypesLoading: boolean;

	fetchContentType: (siteId: string, contentTypeId: string) => Promise<IContentType>;
	contentType?: IContentType,
	contentTypeLoading: boolean;

	createContentType: (siteId: string, contentType: IContentTypeCreateDTO) => Promise<IContentType>;
	createContentTypeLoading: boolean;

	updateContentType: (siteId: string, contentTypeId: string, values: IContentTypeUpdateDTO) => Promise<IContentType>;
	updateContentTypeLoading: boolean;

	removeContentType: (siteId: string, contentTypeId: string) => Promise<void>;
	removeContentTypeLoading: boolean;
}

export interface IContentTypeCreateDTO {
	name: string;
	description?: string;
}

export interface IContentTypeUpdateDTO {
	name: string;
	description?: string;
}
