import { Request, Response, NextFunction } from "express";
import { IFeedResponse } from "@/types/networkTypes";
import mongoose from "mongoose";
import { IGenericTweetRepo, ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweetTypes";
import TweetRepository from "@/repositories/tweetRepo";
import { IGenericCache } from "@/types/cacheTypes";
import { redisClient } from "@/connections/redis";
import { fromAll } from "@/services/feedService";

export async function getFeedFromAll(req: Request, res: Response, next: NextFunction) {
	try {
		const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		const cache: IGenericCache = redisClient;
		const tweetRepo: IGenericTweetRepo = new TweetRepository(tweetModel, cache);
		const response: IFeedResponse = await fromAll(tweetRepo);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}
