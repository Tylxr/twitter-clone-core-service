import { IGenericResponse, ITweetResponse } from "@/types/networkTypes";
import { IGenericTweetModel, IGenericTweetRepo, ITweetDocument, ITweetObject } from "@/types/tweetTypes";
import { IUserProfileObject } from "@/types/userProfileTypes";

export async function createTweet(tweetRepo: IGenericTweetRepo, userProfile: IUserProfileObject, tweet: string): Promise<IGenericResponse> {
	if (typeof tweet !== "string" || tweet.length === 0 || tweet.length > 150) {
		return { error: true, errorMessage: "Tweet body provided is invalid." };
	}

	if (!userProfile || !userProfile.hasOwnProperty("name") || !userProfile.hasOwnProperty("username")) {
		return { error: true, errorMessage: "UserProfile provided is invalid." };
	}

	try {
		await tweetRepo.createTweet(userProfile, tweet);
		return { error: false, message: "Tweet posted successfully." };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error posting a tweet." };
	}
}

export async function createComment(
	tweetRepo: IGenericTweetRepo,
	tweetId: string,
	userProfileId: string,
	comment: string,
	tweetUserId: string,
): Promise<IGenericResponse> {
	if (comment.length === 0) {
		return { error: true, errorMessage: "Comment provided is invalid." };
	}
	try {
		await tweetRepo.postComment(tweetId, userProfileId, comment, tweetUserId);
		return { error: false, message: "Comment posted successfully." };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error posting a comment." };
	}
}

export async function toggleLikeTweet(
	tweetRepo: IGenericTweetRepo,
	tweetId: string,
	userProfileUsername: string,
	tweetUserId: string,
): Promise<IGenericResponse> {
	if (!tweetId || !userProfileUsername) return { error: true, errorMessage: "No tweetId or user profile username provided." };

	try {
		await tweetRepo.toggleLike(tweetId, userProfileUsername, tweetUserId);
		return { error: false };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error trying to like tweet." };
	}
}

export async function toggleLikeTweetComment(
	tweetRepo: IGenericTweetRepo,
	tweetId: string,
	commentId: string,
	userProfileUsername: string,
	tweetUserId: string,
): Promise<IGenericResponse> {
	if (!tweetId || !commentId || !userProfileUsername) return { error: true, errorMessage: "No tweetId, commentId or user profile username provided." };

	try {
		await tweetRepo.toggleLikeTweetComment(tweetId, commentId, userProfileUsername, tweetUserId);
		return { error: false };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error trying to like tweet." };
	}
}

export async function getTweetById(getById: (_id: string, lean?: boolean) => Promise<ITweetDocument | undefined>, tweetId: string): Promise<ITweetResponse> {
	if (!tweetId) return { error: true, errorMessage: "No tweetId provided.", tweet: undefined };

	try {
		const tweet: ITweetDocument = await getById(tweetId);
		return { error: !tweet, tweet, errorMessage: !tweet ? "No tweet found for tweetId: " + tweetId : "" };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error trying to retrieve tweet.", tweet: undefined };
	}
}
