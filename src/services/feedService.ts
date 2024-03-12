import { IFeedFromAllCheckResponse, IFeedResponse } from "@/types/networkTypes";
import { IGenericTweetModel, IGenericTweetRepo, ITweetObject } from "@/types/tweetTypes";

export async function fromAll(tweetRepo: IGenericTweetRepo): Promise<IFeedResponse> {
	try {
		const feed: ITweetObject[] = await tweetRepo.getFeedFromAll();
		return { error: false, feed };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error getting feed from user.", feed: [] };
	}
}

export async function checkFromAll(tweetRepo: IGenericTweetRepo, tweetId: string): Promise<IFeedFromAllCheckResponse> {
	if (!tweetId) return { error: true, errorMessage: "No tweetId provided." };
	try {
		const latest: boolean = await tweetRepo.checkFeedFromAll(tweetId);
		return { error: false, latest };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error checking feed from all." };
	}
}

export async function fromUser(tweetRepo: IGenericTweetRepo, userId: string): Promise<IFeedResponse> {
	if (!userId) {
		return { error: true, errorMessage: "Invalid userId provided.", feed: [] };
	}

	try {
		const feed: ITweetObject[] = await tweetRepo.getFeedFromUser(userId);
		return { error: false, feed };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error getting feed from user.", feed: [] };
	}
}

export async function fromFollowing(tweetRepo: IGenericTweetRepo, userId: string): Promise<IFeedResponse> {
	if (!userId) {
		return { error: true, errorMessage: "Invalid userId provided.", feed: [] };
	}

	try {
		// Call a userModel method that gets the user's following array
		// Using this following array, call a tweetmodel method which gets any tweets that
		// are in the array of followed users. Sort the array and populate as needed.
		// const feed: ITweetObject[] = await
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error getting feed from following.", feed: [] };
	}
}
