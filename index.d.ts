export {};

declare global {
	namespace Express {
		export interface Request {
			userProfile?: string;
			userProfileId?: string;
		}
	}
}
