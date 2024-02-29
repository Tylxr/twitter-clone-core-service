import { ITweetObject } from "./tweetTypes";
import { IUserProfileObject } from "./userProfileTypes";

export interface IGenericResponse {
	error: boolean;
	errorMessage?: string;
	message?: string;
}

export interface INetworkRequestInstance<T> {
	get<C, R = INetworkResponse<T>>(url: string, config?: C): Promise<R>;
	post<D, C, R = INetworkResponse<T>>(url: string, data?: D, config?: C): Promise<R>;
	delete<C, R = INetworkResponse<T>>(url: string, config?: C): Promise<R>;
}

export interface INetworkResponse<T> {
	status: number;
	data: T;
}

export interface IUserProfileResponse extends IGenericResponse {
	userProfile: IUserProfileObject | undefined;
}

export interface IUserProfileIdResponse extends IGenericResponse {
	userId: string | undefined;
}

export interface ITweetResponse extends IGenericResponse {
	tweet: ITweetObject | undefined;
}

export interface IFeedResponse extends IGenericResponse {
	feed: ITweetObject[];
}

export interface IFeedFromAllCheckResponse extends IGenericResponse {
	latest?: boolean;
}
