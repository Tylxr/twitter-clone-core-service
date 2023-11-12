import { Model, Document } from "mongoose";

// Generic types
export interface IUserProfileObject {
	username: string;
	bio: string;
	followers: Array<string>;
	following: Array<string>;
	createdDate: Date;
}

// Document methods live in here
export interface IUserProfileDocument extends IUserProfileObject {
	save(): Promise<IUserProfileObject>;
}

// Generic Tweet ORM model - statics live in here
export interface IGenericUserProfileModel {
	new (userProfile: IUserProfileObject): IUserProfileDocument;
	getByUsername(username: string): Promise<IUserProfileDocument>;
	deleteByUsername(username: string): Promise<void>;
}

// Mongoose concretions
export interface IUserProfileMongooseDocument extends IUserProfileObject, Document {}
export interface IUserProfileMongooseModel extends Model<IUserProfileMongooseDocument> {
	getByUsername(username: string): Promise<IUserProfileDocument>;
	deleteByUsername(username: string): Promise<void>;
	save(): Promise<IUserProfileMongooseDocument>;
}
