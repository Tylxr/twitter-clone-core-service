export interface IAPIResponse {
	error: boolean;
	errorMessage?: string;
}

export type AuthResponse =
	| IAPIResponse
	| {
			token: string;
			refreshToken: string;
	  };

export type AuthGuardResponse = {
	authenticated: boolean;
	expired: boolean;
};
