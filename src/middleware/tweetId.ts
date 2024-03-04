import mongoose, { isValidObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";

export default async function (req: Request, res: Response, next: NextFunction) {
	const { tweetId } = req.params;
	const tweetModel = mongoose.model("Tweet");

	if (!tweetId) {
		return res.status(400).send({ error: true, errorMessage: "No tweetId was supplied for route." });
	}
	if (!isValidObjectId(new mongoose.Types.ObjectId(tweetId))) {
		return res.status(400).send({ error: true, errorMessage: "Type of tweetId was invalid. Unable to cast to ObjectId." });
	}

	try {
		const tweet = await tweetModel.findById(tweetId).populate({
			path: "userProfile",
			model: "UserProfile",
			select: "_id username name",
		});

		if (!tweet) {
			return res.status(400).send({ error: true, errorMessage: `Unable to return tweet for tweetId ${tweetId}` });
		}

		req.tweet = tweet;
		return next();
	} catch (err) {
		console.error(err);
		console.error("Error occurred trying to obtain tweet during tweetId middleware.");
		return res.status(500).send({ error: true });
	}
}
