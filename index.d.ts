import { ITweetMongooseDocument } from "@/types/tweetTypes";
import { IUserProfileObject } from "@/types/userProfileTypes";

export {};

declare global {
	namespace Express {
		export interface Request {
			userProfile?: IUserProfileObject;
			userProfileUsername?: string;
			tweet: ITweetMongooseDocument;
		}
	}
}
