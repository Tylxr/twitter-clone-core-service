import { Model, Document, ObjectId } from "mongoose";
import { IGenericCache } from "./cacheTypes";
import { IGenericResponse } from "./networkTypes";

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
	getIdByUsername(username: string): Promise<string>;
	getByUsername(username: string): Promise<IUserProfileDocument>;
	deleteByUsername(username: string): Promise<void>;
}

// Mongoose concretions
export interface IUserProfileMongooseDocument extends IUserProfileObject, Document {}

export interface IUserProfileMongooseModel extends Model<IUserProfileMongooseDocument> {
	getIdByUsername(username: string): Promise<string>;
	getByUsername(username: string): Promise<IUserProfileMongooseDocument>;
	deleteByUsername(username: string): Promise<void>;
	save(): Promise<IUserProfileMongooseDocument>;
}

// Repo types
export interface IGenericUserProfileRepo {
	retrieveUserProfile(username: string): Promise<IUserProfileResponse>;
}

export interface IUserProfileResponse extends IGenericResponse {
	userProfile: IUserProfileObject | undefined;
}
