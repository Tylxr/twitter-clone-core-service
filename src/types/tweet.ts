import { Model, Document } from "mongoose";
import { IUserProfileObject } from "./userProfile";

// Generic types
export interface ITweetObject {
	userProfile: string;
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
export interface ITweetMongooseDocument extends ITweetObject, Document {}
export interface ITweetMongooseModel extends Model<ITweetMongooseDocument> {
	save(): Promise<ITweetMongooseDocument>;
}
