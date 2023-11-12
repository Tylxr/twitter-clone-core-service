import express, { NextFunction, Request, Response } from "express";
import ensureAuthenticated from "../middleware/auth";
import userProfileRouter from "./userProfile";
import authInstance from "@/utils/authInstance";

const router = express.Router();

// Routes - GET
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

// Routes - POST
router.use(
	"/userProfile",
	// * ensureAuthenticated,
	userProfileRouter(router),
);

// Health check
router.get("/health", (req: Request, res: Response, next: NextFunction) => res.sendStatus(200));

export default router;
