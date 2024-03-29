import { IAPIHALResponse, IPageParameters } from "~shared";

export interface IStorageRepository {
	id: string;
	name: string;
	kind: string;
	configuration: Record<string, string>;
	updatedAt: string;
	createdAt: string;
}

export type IStorageRepositoriesResponse = IAPIHALResponse<'storageRepositories', IStorageRepository>;

export interface IStorageRepositoryStoreState {
	fetchStorageRepositories: (siteId: string, params?: IPageParameters) => Promise<IStorageRepository[]>;
	storageRepositories: IStorageRepository[];
	storageRepositoriesLoading: boolean;

	fetchStorageRepository: (siteId: string, storageRepositoryId: string) => Promise<IStorageRepository>;
	storageRepository?: IStorageRepository,
	storageRepositoryLoading: boolean;

	createStorageRepository: (siteId: string, storageRepository: IStorageRepositoryCreateDTO) => Promise<IStorageRepository>;
	createStorageRepositoryLoading: boolean;

	updateStorageRepository: (siteId: string, storageRepositoryId: string, values: IStorageRepositoryUpdateDTO) => Promise<IStorageRepository>;
	updateStorageRepositoryLoading: boolean;
}

export interface IStorageRepositoryCreateDTO {
	name: string;
	kind: string;
	configuration: Record<string, string>;
}

export interface IStorageRepositoryUpdateDTO {
	name: string;
	configuration: Record<string, string>;
}
