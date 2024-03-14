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
	getFeedFromAll(): Promise<ITweetDocument[]>;
	getFeedFromUser(username: string): Promise<ITweetDocument[]>;
	getFollowingFeedForUser(following: string[]): Promise<ITweetDocument[]>;
	getLatestTweetId(): Promise<string>;
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
	getFeedFromAll(): Promise<ITweetMongooseDocument[]>;
	getFeedFromUser(username: string): Promise<ITweetMongooseDocument[]>;
	getFollowingFeedForUser(following: string[]): Promise<ITweetMongooseDocument[]>;
	getLatestTweetId(): Promise<string>;
	postComment(tweetId: string, userProfileId: string, comment: string): Promise<void>;
	toggleLikeTweet(tweetId: string, userProfileUsername: string): Promise<void>;
	toggleLikeTweetComment(tweetId: string, commentId: string, userProfileUsername: string): Promise<void>;
}

// Repo types
export interface IGenericTweetRepo {
	createTweet(userProfile: IUserProfileObject, tweet: string): Promise<void>;
	getFeedFromAll(): Promise<ITweetObject[]>;
	checkFeedFromAll(tweetId: string): Promise<boolean>;
	getFeedFromUser(username: string): Promise<ITweetObject[]>;
	toggleLike(tweetId: string, userProfileUsername: string, tweetUser: string): Promise<void>;
	postComment(tweetId: string, userProfileUsername: string, comment: string, tweetUser: string): Promise<void>;
	toggleLikeTweetComment(tweetId: string, commentId: string, userProfileUsername: string, tweetUser: string): Promise<void>;
}
