import { IGenericResponse, ITweetResponse } from "@/types/networkTypes";
import { IGenericTweetModel, ITweetObject } from "@/types/tweetTypes";

export async function createTweet(tweetModel: IGenericTweetModel, userProfile: string, tweet: string): Promise<IGenericResponse> {
	if (typeof tweet !== "string" || tweet.length === 0 || tweet.length > 150) {
		return { error: true, errorMessage: "Tweet body provided is invalid." };
	}

	try {
		const tweetObj = new tweetModel({
			userProfile: userProfile,
			body: tweet,
			comments: [],
			likes: [],
			createdDate: new Date(),
		});
		await tweetObj.save();
		return { error: false, message: "Tweet posted successfully." };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error posting a tweet." };
	}
}

export async function createComment(tweetModel: IGenericTweetModel, tweetId: string, userProfileId: string, comment: string): Promise<IGenericResponse> {
	if (comment.length === 0) {
		return { error: true, errorMessage: "Comment provided is invalid." };
	}
	try {
		await tweetModel.postComment(tweetId, userProfileId, comment);
		return { error: false, message: "Tweet posted successfully." };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error posting a tweet." };
	}
}

export async function toggleLikeTweet(tweetModel: IGenericTweetModel, tweetId: string, userProfileUsername: string): Promise<IGenericResponse> {
	if (!tweetId || !userProfileUsername) return { error: true, errorMessage: "No tweetId or user profile username provided." };

	try {
		await tweetModel.toggleLikeTweet(tweetId, userProfileUsername);
		return { error: false };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error trying to like tweet." };
	}
}

export async function toggleLikeTweetComment(
	tweetModel: IGenericTweetModel,
	tweetId: string,
	commentId: string,
	userProfileUsername: string,
): Promise<IGenericResponse> {
	if (!tweetId || !commentId || !userProfileUsername) return { error: true, errorMessage: "No tweetId, commentId or user profile username provided." };

	try {
		await tweetModel.toggleLikeTweetComment(tweetId, commentId, userProfileUsername);
		return { error: false };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error trying to like tweet." };
	}
}

export async function getTweetById(tweetModel: IGenericTweetModel, tweetId: string): Promise<ITweetResponse> {
	if (!tweetId) return { error: true, errorMessage: "No tweetId provided.", tweet: undefined };

	try {
		const tweet: ITweetObject = await tweetModel.getById(tweetId);
		return { error: !tweet, tweet, errorMessage: !tweet ? "No tweet found for tweetId: " + tweetId : "" };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error trying to retrieve tweet.", tweet: undefined };
	}
}
