import { createUserProfile, deleteUserProfile } from "@/services/userProfile";
import { IAPIResponse } from "@/types/network";
import { IGenericUserProfileModel, IUserProfileDocument, IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfile";
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
