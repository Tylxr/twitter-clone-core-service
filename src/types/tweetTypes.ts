import { Model, Document, ObjectId } from "mongoose";
import { IUserProfileMongooseDocument, IUserProfileObject } from "./userProfileTypes";

// Generic types
export interface ITweetObject {
	userProfile: IUserProfileObject | string;
	body: string;
	comments: Comment[];
	likes: string[];
	createdDate: Date;
}

export interface Comment {
	userProfile: IUserProfileObject;
	body: string;
	likes: string[];
}

// Document methods live in here
export interface ITweetDocument extends ITweetObject {
	save(): Promise<ITweetObject>;
}

// Generic Tweet ORM model - statics live in here
export interface IGenericTweetModel {
	new (tweet: ITweetObject): ITweetDocument;
	getById(_id: string, lean?: boolean): Promise<ITweetDocument | undefined>;
	postComment(tweetId: string, userProfileId: string, comment: string): Promise<void>;
	toggleLikeTweet(tweetId: string, userProfileUsername: string): Promise<void>;
	toggleLikeTweetComment(tweetId: string, commentId: string, userProfileUsername: string): Promise<void>;
}

// Mongoose concretions
export interface ITweetMongooseDocument extends Omit<ITweetObject, "userProfile">, Document {
	userProfile: IUserProfileMongooseDocument;
}
export interface ITweetMongooseModel extends Model<ITweetMongooseDocument> {
	save(): Promise<ITweetMongooseDocument>;
	getById(_id: string, lean?: boolean): Promise<ITweetMongooseDocument | undefined>;
	postComment(tweetId: string, userProfileId: string, comment: string): Promise<void>;
	toggleLikeTweet(tweetId: string, userProfileUsername: string): Promise<void>;
	toggleLikeTweetComment(tweetId: string, commentId: string, userProfileUsername: string): Promise<void>;
}
