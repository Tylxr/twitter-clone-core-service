import express, { NextFunction, Request, Response } from "express";
import ensureAuthenticated from "../middleware/auth";
import userProfileRoutes from "./userProfileRoutes";
import tweetsRoutes from "./tweetsRoutes";
import feedRoutes from "./feedRoutes";
import authInstance from "@/connections/authInstance";
import mongoose, { ObjectId } from "mongoose";
import { IGenericUserProfileModel, IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfileTypes";

const router = express.Router();

// Health check
router.get("/health", (req: Request, res: Response, next: NextFunction) => res.sendStatus(200));

// Secure the routes below
router.use((req: Request, res: Response, next: NextFunction) => {
	const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
	ensureAuthenticated(authInstance, userProfileModel)(req, res, next);
});

// Routes
router.use("/userProfile", userProfileRoutes);
router.use("/tweet", tweetsRoutes);
router.use("/feed", feedRoutes);

export default router;
