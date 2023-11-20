import { Request, Response, NextFunction } from "express";
import { IAPIResponse } from "@/types/network";
import mongoose from "mongoose";
import { ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweet";
import { createTweet } from "@/services/tweets";

export async function postTweet(req: Request, res: Response, next: NextFunction) {
	try {
		const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		const { userProfile } = req;
		const { tweet } = req.body;
		const response: IAPIResponse = await createTweet(userProfile, tweet, tweetModel);
		return res.status(response.error ? 400 : 201).send(response);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}
