import { IGenericTweetModel } from "@/types/tweet";

export async function createTweet(userProfile: string, tweet: string, tweetModel: IGenericTweetModel) {
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

	if (typeof tweet !== "string" || tweet.length === 0 || tweet.length > 150) {
		return { error: true, errorMessage: "Tweet body provided is invalid." };
	}

	try {
		const tweetObj = new tweetModel({
			userProfile: userProfile,
			body: tweet,
			comments: [],
			likes: 0,
			createdDate: new Date(),
		});
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error posting a tweet." };
	}
}
