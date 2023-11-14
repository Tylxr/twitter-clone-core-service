import { IGenericTweetModel } from "@/types/tweet";

export async function postTweet(userProfile: string, tweet: string, tweetModel: IGenericTweetModel) {
	/**
	 * params:
	 *  - userProfile
	 *  - tweet body
	 *  - generic tweet collection
	 *
	 * logic:
	 *  - Validate tweet body
	 *  - create a tweet object
	 *  - save it
	 *  - return out
	 */
}
