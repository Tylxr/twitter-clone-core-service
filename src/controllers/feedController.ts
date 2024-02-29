import { Request, Response, NextFunction } from "express";
import { IFeedFromAllCheckResponse, IFeedResponse } from "@/types/networkTypes";
import mongoose, { isValidObjectId } from "mongoose";
import { IGenericTweetRepo, ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweetTypes";
import TweetRepository from "@/repositories/tweetRepo";
import { IGenericCache } from "@/types/cacheTypes";
import { redisClient } from "@/connections/redis";
import { checkFromAll, fromAll, fromUser } from "@/services/feedService";
import { IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfileTypes";
import { retrieveUserIdByUsername } from "@/services/userProfileService";

export async function getFeedFromAll(req: Request, res: Response, next: NextFunction) {
	try {
		const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		const cache: IGenericCache = redisClient;
		const tweetRepo: IGenericTweetRepo = new TweetRepository(tweetModel, cache);
		const response: IFeedResponse = await fromAll(tweetRepo);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: true });
	}
}

export async function checkFeedFromAll(req: Request, res: Response, next: NextFunction) {
	try {
		const { tweetId } = req.body;
		if (!isValidObjectId(tweetId)) {
			return res.status(400).send({ error: true, errorMessage: `Invalid tweetId provided - unable to cast '${tweetId}' to ObjectId.` });
		}

		const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		const cache: IGenericCache = redisClient;
		const tweetRepo: IGenericTweetRepo = new TweetRepository(tweetModel, cache);
		const response: IFeedFromAllCheckResponse = await checkFromAll(tweetRepo, tweetId);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: true });
	}
}

export async function getFeedFromUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { username } = req.params;

		// Grab the userId using the username
		const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
		const userIdResponse = await retrieveUserIdByUsername(userProfileModel, username);
		if (userIdResponse.error) return res.status(400).send({ error: userIdResponse.error, errorMessage: userIdResponse.errorMessage });

		// Grab the tweets that match the userId
		const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		const cache: IGenericCache = redisClient;
		const tweetRepo: IGenericTweetRepo = new TweetRepository(tweetModel, cache);
		const response: IFeedResponse = await fromUser(tweetRepo, userIdResponse.userId);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: true });
	}
}
