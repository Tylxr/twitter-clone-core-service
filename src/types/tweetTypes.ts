import { Model, Document, ObjectId } from "mongoose";
import { IUserProfileMongooseDocument, IUserProfileObject } from "./userProfileTypes";

// Generic types
export interface ITweetObject {
	userProfile: IUserProfileObject | string;
	body: string;
	comments: Comment[];
	likes: number;
	createdDate: Date;
}

export interface Comment {
	userProfile: IUserProfileObject;
	body: string;
	likes: number;
}

// Document methods live in here
export interface ITweetDocument extends ITweetObject {
	save(): Promise<ITweetObject>;
}

// Generic Tweet ORM model - statics live in here
export interface IGenericTweetModel {
	new (tweet: ITweetObject): ITweetDocument;
}

// Mongoose concretions
export interface ITweetMongooseDocument extends Omit<ITweetObject, "userProfile">, Document {
	userProfile: IUserProfileMongooseDocument;
}
export interface ITweetMongooseModel extends Model<ITweetMongooseDocument> {
	save(): Promise<ITweetMongooseDocument>;
}
