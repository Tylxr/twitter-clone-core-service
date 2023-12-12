import { redisClient } from "@/connections/redis";
import UserProfileRepository from "@/repositories/userProfileRepo";
import { createUserProfile, deleteUserProfile, retrieveUserProfile } from "@/services/userProfileService";
import { IGenericCache } from "@/types/cacheTypes";
import { IGenericResponse } from "@/types/networkTypes";
import { IUserProfileResponse, IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfileTypes";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export async function createProfile(req: Request, res: Response, next: NextFunction) {
	try {
		const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
		const { username } = req.body;
		const response: IGenericResponse = await createUserProfile(username, userProfileModel);
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
		const response: IUserProfileResponse = await retrieveUserProfile(userProfileRepo, req.params.username);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}
