import express, { NextFunction, Request, Response } from "express";
import ensureAuthenticated from "../middleware/auth";
import userProfileRouter from "./userProfile";
import tweetsRouter from "./tweets";
import authInstance from "@/utils/authInstance";

const router = express.Router();

// Health check
router.get("/health", (req: Request, res: Response, next: NextFunction) => res.sendStatus(200));

//* Temporary routes
router.get("/tweets", ensureAuthenticated(authInstance), (req, res, next) => {
	res.send({
		tweets: [
			{
				id: 1,
				tweet: "The first ever tweet",
			},
			{
				id: 2,
				tweet: "Another tweet...",
			},
		],
	});
});

// Secure the routes below
router.use(ensureAuthenticated(authInstance));

// Routes
router.use("/userProfile", userProfileRouter(router));
router.use("/tweet", tweetsRouter(router));

export default router;
