import { Request, Response, NextFunction } from "express";
import { IGenericResponse, ITweetResponse } from "@/types/networkTypes";
import mongoose from "mongoose";
import { ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweetTypes";
import { getTweetById } from "@/services/tweetsService";

export async function getFeedFromAll(req: Request, res: Response, next: NextFunction) {
	try {
		// const { tweetId } = req.params;
		// const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
		// const response: ITweetResponse = await getTweetById(tweetModel, tweetId);
		// return res.status(response.error ? 400 : 200).send(response);
		// TODO: Need to Call a service method and pass in a REPO instance. The repo instance will handle cache or model
		// TODO  retrieval, rather than the service trying to do it.
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}
