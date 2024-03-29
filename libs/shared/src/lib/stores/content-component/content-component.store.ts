import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { kyInstance, wrapApi } from '../../services/ky.instance';

import { IContentComponent, IContentComponentStoreState, IContentComponentsResponse } from './content-component.types';

export const useContentComponentStore = create<IContentComponentStoreState>()(
	devtools(
		(set) => ({
			fetchContentComponents: async (siteId, options) => {
				const [result, error] = await wrapApi(
					kyInstance
						.get(
							`/admin-api/v1/sites/${siteId}/content-components`,
							{
								searchParams: {
									...options,
								},
							}
						)
						.json<IContentComponentsResponse>()
				);

				if (error) {
					set(() => ({ contentComponents: [], contentComponentsLoading: false }));
					throw error;
				}

				set(() => ({ contentComponents: result._embedded.contentComponents, contentComponentsPagination: result._page, contentComponentsLoading: false }));
			},
			contentComponents: [],
			contentComponentsLoading: false,

			fetchContentComponent: async (siteId, contentComponentId) => {
				set(() => ({ contentComponentLoading: true }));
				const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content-components/${contentComponentId}`).json<IContentComponent>());
	
				if (error) {
					set(() => ({ contentComponent: undefined, contentComponentLoading: false }));
					throw error;
				}
				
				set(() => ({ contentComponent: result, contentComponentLoading: false }));
				return result;
			},
			contentComponent: undefined,
			contentComponentLoading: false,
	
			createContentComponent: async (siteId, contentComponent) => {
				set(() => ({ createContentComponentLoading: true }));
				const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/sites/${siteId}/content-components`, {
					json: {
						...contentComponent,
						fields: []
					},
				}).json<IContentComponent>());
				set(() => ({ createContentComponentLoading: false }));
	
				if (error) {
					throw error;
				}
				
				return result;
			},
			createContentComponentLoading: false,
	
			updateContentComponent: async (siteId, contentComponentId, data) => {
				set(() => ({ updateContentComponentLoading: true }));
				const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/sites/${siteId}/content-components/${contentComponentId}`, {
					json: data,
				}).json<IContentComponent>());
	
				if (error) {
					set(() => ({ updateContentComponentLoading: false }));
					throw error;
				}
				
				set(() => ({ contentComponent: result, updateContentComponentLoading: false }));
				return result;
			},
			updateContentComponentLoading: false,
	
			removeContentComponent: async (siteId, contentComponentId) => {
				set(() => ({ removeContentComponentLoading: true }));
				const [_, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/sites/${siteId}/content-components/${contentComponentId}`).json<void>());
	
				if (error) {
					set(() => ({ removeContentComponentLoading: false }));
					throw error;
				}
				
				set(() => ({ removeContentComponentLoading: false }));
				return;
			},
			removeContentComponentLoading: false,
		}),
		{ name: 'contentComponentStore' }
	)
);
