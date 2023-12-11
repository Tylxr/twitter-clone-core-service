import { redisClient } from "@/connections/redis";
import UserProfileRepository from "@/repositories/userProfileRepo";
import { createUserProfile, deleteUserProfile } from "@/services/userProfileService";
import { IGenericCache } from "@/types/cacheTypes";
import { IAPIResponse } from "@/types/networkTypes";
import { IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfileTypes";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export async function createProfile(req: Request, res: Response, next: NextFunction) {
	try {
		const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
		const { username } = req.body;
		const response: IAPIResponse = await createUserProfile(username, userProfileModel);
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
		const response: IAPIResponse = await deleteUserProfile(username, userProfileModel);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

export async function retrieveProfile(req: Request, res: Response, next: NextFunction) {
	try {
		/**
		 *  Create a userprofile repo instance. Pass in model & redis.
		 *  Service should accept the generic model and generic caching layer.
		 *      Service logic:
		 *          - Call the userprofile repo.
		 *            Userprofile repo logic:
		 *              Go and get the user profile.
		 *              - The logic for this is that it tries to retrieve it from the cache.
		 *              if cachedEntry
		 *                 return cachedEntry;
		 *              else
		 *                  go get user profile from db
		 *                  set in cache
		 *                  return user profile
		 *
		 * Then I feel like I should implement pub/sub pattern for cache invalidation.
		 * When I write the PATCH /userProfile route, I will implement it. I can publish the event
		 * and listen to it in the services file - maybe a new 'eventsService.ts' file that's imported
		 * somewhere more global, maybe app.ts.
		 */

		const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
		const cache: IGenericCache = redisClient;
		const userProfileRepo = new UserProfileRepository(userProfileModel, cache);

		// TODO: Call service method, passing repo into it. Service should call repo method. Repo implementation needs
		// TODO: to be written.
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}
