import { Model, Document, ObjectId } from "mongoose";

// Generic types
export interface IUserProfileObject {
	_id?: string;
	username: string;
	name: string;
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
	getByUsername(username: string, lean?: boolean): Promise<IUserProfileDocument | undefined>;
	deleteByUsername(username: string): Promise<void>;
	toggleFollow(userToFollow: string, userProfileUsername: string): Promise<void>;
}

// Mongoose concretions
export interface IUserProfileMongooseDocument extends Omit<IUserProfileObject, "_id">, Document {}

export interface IUserProfileMongooseModel extends Model<IUserProfileMongooseDocument> {
	getIdByUsername(username: string): Promise<string>;
	getByUsername(username: string, lean?: boolean): Promise<IUserProfileMongooseDocument | undefined>;
	deleteByUsername(username: string): Promise<void>;
	toggleFollow(userToFollow: string, userProfileUsername: string): Promise<void>;
	save(): Promise<IUserProfileMongooseDocument>;
}

// Repo types
export interface IGenericUserProfileRepo {
	retrieveUserProfile(username: string): Promise<IUserProfileObject | null>;
	updateUserProfile(username: string, data: { bio: string; name: string }): Promise<void>;
}
