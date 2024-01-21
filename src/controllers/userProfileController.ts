import { redisClient } from "@/connections/redis";
import UserProfileRepository from "@/repositories/userProfileRepo";
import { createUserProfile, deleteUserProfile, retrieveUserProfile, toggleFollowUser, updateUserProfile } from "@/services/userProfileService";
import { IGenericCache } from "@/types/cacheTypes";
import { IGenericResponse, IUserProfileResponse } from "@/types/networkTypes";
import { IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfileTypes";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export async function createProfile(req: Request, res: Response, next: NextFunction) {
	try {
		const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
		const { username, name } = req.body;
		const response: IGenericResponse = await createUserProfile(username, name, userProfileModel);
		return res.status(response.error ? 400 : 201).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

export async function deleteProfile(req: Request, res: Response, next: NextFunction) {
	try {
		const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
		const { username } = req.body;
		const response: IGenericResponse = await deleteUserProfile(username, userProfileModel);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

export async function retrieveProfile(req: Request, res: Response, next: NextFunction) {
	try {
		const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
		const cache: IGenericCache = redisClient;
		const userProfileRepo = new UserProfileRepository(userProfileModel, cache);
		const { username } = req.params;
		const response: IUserProfileResponse = await retrieveUserProfile(userProfileRepo, username);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
	try {
		const { bio } = req.body;
		const { userProfileUsername, userProfile } = req;
		const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
		const cache: IGenericCache = redisClient;
		const userProfileRepo = new UserProfileRepository(userProfileModel, cache);
		const response: IGenericResponse = await updateUserProfile(userProfileRepo, userProfileUsername, bio);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

export async function toggleFollow(req: Request, res: Response, next: NextFunction) {
	try {
		const { username } = req.params;
		const { userProfileUsername } = req;
		const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
		const response: IGenericResponse = await toggleFollowUser(userProfileModel, username, userProfileUsername);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}
