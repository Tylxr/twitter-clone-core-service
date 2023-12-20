import { IGenericResponse } from "@/types/networkTypes";
import { IGenericTweetModel } from "@/types/tweetTypes";

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

export async function toggleLikeTweetComment(): Promise<IGenericResponse> {}
