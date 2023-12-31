import { IFeedResponse } from "@/types/networkTypes";
import { IGenericTweetRepo, ITweetObject } from "@/types/tweetTypes";

export async function fromAll(tweetRepo: IGenericTweetRepo): Promise<IFeedResponse> {
	try {
		const feed: ITweetObject[] = await tweetRepo.getFeedFromAll();
		return { error: false, feed };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error posting a tweet.", feed: [] };
	}
}

export async function fromUser(tweetRepo: IGenericTweetRepo, username: string): Promise<IFeedResponse> {
	if (!username || username.length < 4) {
		return { error: true, errorMessage: "Invalid username provided.", feed: [] };
	}

	try {
		const feed: ITweetObject[] = await tweetRepo.getFeedFromUser(username);
		return { error: false, feed };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error posting a tweet.", feed: [] };
	}
}
