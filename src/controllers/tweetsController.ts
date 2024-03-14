import { Request, Response, NextFunction } from "express";
import { IGenericResponse, ITweetResponse } from "@/types/networkTypes";
import mongoose from "mongoose";
import { IGenericTweetRepo, ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweetTypes";
import { createComment, createTweet, getTweetById, toggleLikeTweet, toggleLikeTweetComment } from "@/services/tweetsService";
import { redisClient } from "@/connections/redis";
import { IGenericCache } from "@/types/miscTypes";
import TweetRepository from "@/repositories/tweetRepo";
import { getEmitter } from "@/connections/events";

export async function postTweet(req: Request, res: Response, next: NextFunction) {
	const { userProfile } = req;
	const { tweet } = req.body;
	const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
	const cache: IGenericCache = redisClient;
	const tweetRepo: IGenericTweetRepo = new TweetRepository(tweetModel, cache);

	try {
		const response: IGenericResponse = await createTweet(tweetRepo, userProfile, tweet);

		if (!response.error) {
			getEmitter().emit("POST_CREATED", userProfile._id);
		}

		return res.status(response.error ? 400 : 201).send(response);
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: true });
	}
}

export async function postComment(req: Request, res: Response, next: NextFunction) {
	const { tweetId } = req.params;
	const { userProfile } = req;
	const { comment } = req.body;
	const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
	const cache: IGenericCache = redisClient;
	const tweetRepo: IGenericTweetRepo = new TweetRepository(tweetModel, cache);
	const tweetUserId = req.tweet.userProfile._id;

	try {
		const response: IGenericResponse = await createComment(tweetRepo, tweetId, userProfile._id, comment, tweetUserId);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: true });
	}
}

export async function likeTweet(req: Request, res: Response, next: NextFunction) {
	const { tweetId } = req.params;
	const { userProfileUsername } = req;
	const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
	const cache: IGenericCache = redisClient;
	const tweetRepo: IGenericTweetRepo = new TweetRepository(tweetModel, cache);
	const tweetUserId = req.tweet.userProfile._id;

	try {
		const response: IGenericResponse = await toggleLikeTweet(tweetRepo, tweetId, userProfileUsername, tweetUserId);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: true });
	}
}

export async function likeTweetComment(req: Request, res: Response, next: NextFunction) {
	const { tweetId, commentId } = req.params;
	const { userProfileUsername } = req;
	const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
	const cache: IGenericCache = redisClient;
	const tweetRepo: IGenericTweetRepo = new TweetRepository(tweetModel, cache);
	const tweetUserId = req.tweet.userProfile._id;

	try {
		const response: IGenericResponse = await toggleLikeTweetComment(tweetRepo, tweetId, commentId, userProfileUsername, tweetUserId);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: true });
	}
}

export async function getTweet(req: Request, res: Response, next: NextFunction) {
	const { tweetId } = req.params;
	const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");

	try {
		const response: ITweetResponse = await getTweetById(tweetModel, tweetId);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: true });
	}
}
