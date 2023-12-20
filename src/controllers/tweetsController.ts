import { Request, Response, NextFunction } from "express";
import { IGenericResponse } from "@/types/networkTypes";
import mongoose from "mongoose";
import { ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweetTypes";
import { createTweet, toggleLikeTweet } from "@/services/tweetsService";

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

export async function likeComment(req: Request, res: Response, next: NextFunction) {
	try {
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}
