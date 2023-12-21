import { Request, Response, NextFunction } from "express";
import { IGenericResponse, ITweetResponse } from "@/types/networkTypes";
import mongoose from "mongoose";
import { ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweetTypes";
import { createComment, createTweet, getTweetById, toggleLikeTweet, toggleLikeTweetComment } from "@/services/tweetsService";

export async function postTweet(req: Request, res: Response, next: NextFunction) {
	try {
		const { userProfileUsername } = req;
		const { tweet } = req.body;
		const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		const response: IGenericResponse = await createTweet(tweetModel, userProfileUsername, tweet);
		return res.status(response.error ? 400 : 201).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

export async function postComment(req: Request, res: Response, next: NextFunction) {
	try {
		const { tweetId } = req.params;
		const { userProfile } = req;
		const { comment } = req.body;
		const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		const response: IGenericResponse = await createComment(tweetModel, tweetId, userProfile._id, comment);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

export async function likeTweet(req: Request, res: Response, next: NextFunction) {
	try {
		const { tweetId } = req.params;
		const { userProfileUsername } = req;
		const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		const response: IGenericResponse = await toggleLikeTweet(tweetModel, tweetId, userProfileUsername);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

export async function likeTweetComment(req: Request, res: Response, next: NextFunction) {
	try {
		const { tweetId, commentId } = req.params;
		const { userProfileUsername } = req;
		const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		const response: IGenericResponse = await toggleLikeTweetComment(tweetModel, tweetId, commentId, userProfileUsername);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

export async function getTweet(req: Request, res: Response, next: NextFunction) {
	try {
		const { tweetId } = req.params;
		const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		const response: ITweetResponse = await getTweetById(tweetModel, tweetId);
		return res.status(response.error ? 400 : 200).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}
