import { Model, Document, ObjectId } from "mongoose";
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
	getByUsername(username: string, lean?: boolean): Promise<IUserProfileDocument>;
	deleteByUsername(username: string): Promise<void>;
	toggleFollow(userToFollow: string, userProfileUsername: string): Promise<void>;
}

// Mongoose concretions
export interface IUserProfileMongooseDocument extends IUserProfileObject, Document {}

export interface IUserProfileMongooseModel extends Model<IUserProfileMongooseDocument> {
	getIdByUsername(username: string): Promise<string>;
	getByUsername(username: string, lean?: boolean): Promise<IUserProfileMongooseDocument | null>;
	deleteByUsername(username: string): Promise<void>;
	toggleFollow(userToFollow: string, userProfileUsername: string): Promise<void>;
	save(): Promise<IUserProfileMongooseDocument>;
}

// Repo types
export interface IGenericUserProfileRepo {
	retrieveUserProfile(username: string): Promise<IUserProfileObject | null>;
	updateUserProfile(username: string, bio: string): Promise<void>;
}

export interface IUserProfileResponse extends IGenericResponse {
	userProfile: IUserProfileObject | undefined;
}
