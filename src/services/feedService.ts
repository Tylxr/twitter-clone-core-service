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
