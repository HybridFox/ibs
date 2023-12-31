import { ISite } from "./site.types";

export interface IUser {
	name: string;
	email: string;
	avatar: string;
}

export interface IMeReponse {
	token: string;
	user: IUser;
	sites: ISite[];
}
