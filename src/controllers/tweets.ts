import { Request, Response, NextFunction } from "express";
import { createUserProfile, deleteUserProfile } from "@/services/userProfile";
import { IAPIResponse } from "@/types/network";
import { IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfile";
import mongoose from "mongoose";
import { ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweet";
import { createTweet } from "@/services/tweets";

export async function postTweet(req: Request, res: Response, next: NextFunction) {
	try {
		// const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
		// const { username } = req.body;
		// const response: IAPIResponse = await createUserProfile(username, userProfileModel);
		// return res.status(response.error ? 400 : 201).send(response);
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
