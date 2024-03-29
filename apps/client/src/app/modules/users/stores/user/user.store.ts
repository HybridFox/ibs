import { create } from 'zustand';
import { devtools } from 'zustand/middleware'


import { ISitesResponse } from '../../../sites/stores/site';

import { IUserStoreState, IUsersResponse } from './user.types';

import { DEFAULT_PAGINATION_OPTIONS, IUser, kyInstance, wrapApi } from '~shared';

export const useUserStore = create<IUserStoreState>()(devtools(
	(set) => ({
		fetchUsers: async (searchParams) => {
			set(() => ({ usersLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/users`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IUsersResponse>());

			if (error) {
				return set(() => ({ users: [], usersLoading: false }))
			}
			
			set(() => ({ users: result._embedded.users, usersPagination: result._page, usersLoading: false }));
		},
		users: [],
		usersLoading: false,

		fetchUser: async (siteId) => {
			set(() => ({ userLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/users/${siteId}`).json<IUser>());

			if (error) {
				set(() => ({ user: undefined, userLoading: false }));
				throw error;
			}
			
			set(() => ({ user: result, userLoading: false }));
		},
		user: undefined,
		userLoading: false,

		createUser: async (user) => {
			set(() => ({ createUserLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/users`, {
				json: user,
			}).json<IUser>());
			set(() => ({ createUserLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createUserLoading: false,

		updateUser: async (userId, data) => {
			set(() => ({ updateUserLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/users/${userId}`, {
				json: data,
			}).json<IUser>());

			if (error) {
				set(() => ({ updateUserLoading: false }));
				throw error;
			}
			
			set(() => ({ workflow: result, updateUserLoading: false }));
			return result;
		},
		updateUserLoading: false,

		removeUser: async (userId) => {
			set(() => ({ removeUserLoading: true }));
			const [result, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/users/${userId}`).json<void>());

			if (error) {
				set(() => ({ removeUserLoading: false }));
				throw error;
			}
			
			set(() => ({ removeUserLoading: false }));
			return result;
		},
		removeUserLoading: false,

		fetchUserSites: async (userId, searchParams) => {
			set(() => ({ usersLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/users/${userId}/sites`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<ISitesResponse>());

			if (error) {
				return set(() => ({ users: [], usersLoading: false }))
			}
			
			set(() => ({ userSites: result._embedded.sites, userSitesPagination: result._page, usersLoading: false }));
		},
		userSites: [],
		userSitesLoading: false,
	}), { name: 'userStore' }
))
