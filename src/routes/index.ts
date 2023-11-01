import express, { NextFunction, Request, Response } from "express";
import ensureAuthenticated from "../middleware/auth";

const router = express.Router();

// Routes - GET
router.get("/tweets", ensureAuthenticated, (req, res, next) => {
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

// Health check
router.get("/health", (req: Request, res: Response, next: NextFunction) => res.sendStatus(200));

export default router;
