import express, { NextFunction, Request, Response } from "express";
import ensureAuthenticated from "../middleware/auth";
import userProfileRoutes from "./userProfileRoutes";
import tweetsRoutes from "./tweetsRoutes";
import feedRoutes from "./feedRoutes";
import authInstance from "@/connections/authInstance";
import mongoose from "mongoose";
import { IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfileTypes";
import { AuthenticationMiddlewareResponse } from "@/types/networkTypes";

const router = express.Router();

// Health check
router.get("/health", (req: Request, res: Response, next: NextFunction) => res.sendStatus(200));

// Secure the routes below
router.use(async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization && req.headers.authorization.split("Bearer ")?.[1];
	const response: AuthenticationMiddlewareResponse = await ensureAuthenticated(token, authInstance);
	if (response.authenticated) {
		if (response.data) {
			const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
			req.userProfileUsername = response.data.username;
			req.userProfile = await userProfileModel.getByUsername(response.data.username, true);
		}
		return next();
	} else {
		return res.status(401).send(response);
	}
});

// Routes
router.use("/userProfile", userProfileRoutes);
router.use("/tweet", tweetsRoutes);
router.use("/feed", feedRoutes);

export default router;
