export interface IAPIResponse {
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
