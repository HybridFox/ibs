import { Navigate, RouteObject } from "react-router-dom";

import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_SITE_ROOT_PATH}/content-types`;
const DETAIL_PATH = `${ROOT_PATH}/:contentTypeId`;
const FIELD_DETAIL_PATH = `${DETAIL_PATH}/fields/:fieldId`;
const BLOCK_DETAIL_PATH = `${FIELD_DETAIL_PATH}/blocks/:blockId`;
const COMPARTMENT_DETAIL_PATH = `${DETAIL_PATH}/compartments/:compartmentId`;

export const CONTENT_TYPES_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
	DETAIL_SETTINGS: `${DETAIL_PATH}/settings`,
	DETAIL_CC: `${DETAIL_PATH}/content-components`,

	FIELD_DETAIL: `${FIELD_DETAIL_PATH}`,
	FIELD_DETAIL_SETTINGS: `${FIELD_DETAIL_PATH}/settings`,
	FIELD_DETAIL_CONFIGURATION: `${FIELD_DETAIL_PATH}/configuration`,
	FIELD_DETAIL_VALIDATION: `${FIELD_DETAIL_PATH}/validation`,
	FIELD_DETAIL_BLOCKS: `${FIELD_DETAIL_PATH}/blocks`,
	FIELD_DETAIL_DEFAULT_VALUE: `${FIELD_DETAIL_PATH}/default-value`,
	
	BLOCK_DETAIL: `${BLOCK_DETAIL_PATH}`,
	BLOCK_DETAIL_SETTINGS: `${BLOCK_DETAIL_PATH}/settings`,
	BLOCK_DETAIL_CONFIGURATION: `${BLOCK_DETAIL_PATH}/configuration`,

	COMPARTMENT_DETAIL: `${COMPARTMENT_DETAIL_PATH}`,
}

export const CONTENT_TYPE_ROUTES: RouteObject[] = [
	{
		path: CONTENT_TYPES_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/ct-list/ct-list.page')).CTListPage }),
	},
	{
		path: CONTENT_TYPES_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/ct-create/ct-create.page')).CTCreatePage }),
	},
	{
		path: CONTENT_TYPES_PATHS.DETAIL,
		children: [
			{
				path: '',
				lazy: async () => ({ Component: (await import('./pages/ct-detail/ct-detail.page')).CTDetailPage }),
				children: [
					{
						path: '',
						element: <Navigate replace to="content-components" />,
					},
					{
						path: CONTENT_TYPES_PATHS.DETAIL_SETTINGS,
						lazy: async () => ({ Component: (await import('./pages/ct-settings/ct-settings.page')).CTSettingsPage }),
					},
					{
						path: CONTENT_TYPES_PATHS.DETAIL_CC,
						lazy: async () => ({ Component: (await import('./pages/ct-content-components/ct-content-components.page')).CTContentComponentsPage }),
					},
				],
			},
			{
				path: CONTENT_TYPES_PATHS.FIELD_DETAIL,
				lazy: async () => ({ Component: (await import('./pages/field-detail/field-detail.page')).FieldDetailPage }),
				children: [
					{
						path: '',
						element: <Navigate replace to="settings" />,
					},
					{
						path: CONTENT_TYPES_PATHS.FIELD_DETAIL_SETTINGS,
						lazy: async () => ({ Component: (await import('./pages/field-settings/field-settings.page')).FieldSettingsPage }),
					},
					{
						path: CONTENT_TYPES_PATHS.FIELD_DETAIL_CONFIGURATION,
						lazy: async () => ({ Component: (await import('./pages/field-configuration/field-configuration.page')).FieldConfigurationPage }),
					},
					{
						path: CONTENT_TYPES_PATHS.FIELD_DETAIL_BLOCKS,
						lazy: async () => ({ Component: (await import('./pages/field-blocks/field-blocks.page')).FieldBlocksPage }),
					},
					{
						path: CONTENT_TYPES_PATHS.FIELD_DETAIL_VALIDATION,
						lazy: async () => ({ Component: (await import('./pages/field-validation/field-validation.page')).FieldValidationPage }),
					},
				]
			},
			{
				path: CONTENT_TYPES_PATHS.BLOCK_DETAIL,
				lazy: async () => ({ Component: (await import('./pages/block-detail/block-detail.page')).BlockDetailPage }),
				children: [
					{
						path: '',
						element: <Navigate replace to="settings" />,
					},
					{
						path: CONTENT_TYPES_PATHS.BLOCK_DETAIL_SETTINGS,
						lazy: async () => ({ Component: (await import('./pages/block-settings/block-settings.page')).BlockSettingsPage }),
					},
					{
						path: CONTENT_TYPES_PATHS.BLOCK_DETAIL_CONFIGURATION,
						lazy: async () => ({ Component: (await import('./pages/block-configuration/block-configuration.page')).BlockConfigurationPage }),
					},
				]
			},
			{
				path: CONTENT_TYPES_PATHS.COMPARTMENT_DETAIL,
				lazy: async () => ({ Component: (await import('./pages/compartment-detail/compartment-detail.page')).CompartmentDetailPage }),
			},
		],
	},
];
