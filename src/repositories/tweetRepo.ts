import { IGenericCache } from "@/types/cacheTypes";
import { IGenericTweetModel, IGenericTweetRepo, ITweetObject } from "@/types/tweetTypes";

export default class TweetRepository implements IGenericTweetRepo {
	private tweetModel: IGenericTweetModel;
	private cache: IGenericCache;

	constructor(tweetModel: IGenericTweetModel, cache: IGenericCache) {
		this.tweetModel = tweetModel;
		this.cache = cache;
	}

	public async createTweet(userProfile: string, tweet: string): Promise<void> {
		try {
			const tweetObj = new this.tweetModel({
				userProfile: userProfile,
				body: tweet,
				comments: [],
				likes: [],
				createdDate: new Date(),
			});
			await tweetObj.save();
		} catch (err) {
			console.error(err);
			throw new Error("Unable to create tweet for user: " + userProfile);
		}

		try {
			// Remove this user's cached feed
			await this.cache.delete(`feed_from_user_${userProfile}`);
			console.log(`Removed ${userProfile}'s feed from the cache as a new tweet was created.`);
		} catch (err) {
			console.error(err);
			throw new Error("Unable to invalidate feed cache for: feed_from_user_" + userProfile);
		}
	}

	public async getFeedFromAll(): Promise<ITweetObject[]> {
		const cachedFeed: ITweetObject[] = await this.cache.get("feed_from_all");
		if (cachedFeed) {
			console.log("A feed_from_all record was found in cache. Returning cached feed.");
			return cachedFeed;
		} else {
			try {
				const feed = await this.tweetModel.getFeedFromAll();
				if (feed.length > 0) {
					await this.cache.set("feed_from_all", feed, { EX: 60 * 60 });
					console.log("Unable to find 'feed_from_all' in the cache. Updating cache. Pulled record from DB.");
				}
				return feed;
			} catch (err) {
				console.error(err);
				throw new Error("Unable to retrieve 'feed from all' from DB.");
			}
		}
	}

	public async getFeedFromUser(username: string): Promise<ITweetObject[]> {
		const cachedFeed: ITweetObject[] = await this.cache.get(`feed_from_user_${username}`);
		if (cachedFeed) {
			console.log(`The feed for user: ${username} was found in cache. Returning cached feed.`);
			return cachedFeed;
		} else {
			try {
				const feed = await this.tweetModel.getFeedFromUser(username);
				if (feed.length > 0) {
					await this.cache.set(`feed_from_user_${username}`, feed, { EX: 60 * 60 * 6 });
					console.log("Unable to find 'feed_from_all' in the cache. Updating cache. Pulled record from DB.");
				}
				return feed;
			} catch (err) {
				console.error(err);
				throw new Error(`Unable to retrieve 'feed for user' from DB for user: ${username}`);
			}
		}
	}
}
