import { emit } from "@/connections/socketio";
import { IGenericCache, SocketEmitter } from "@/types/miscTypes";
import { IGenericTweetModel, IGenericTweetRepo, ITweetObject } from "@/types/tweetTypes";
import { IUserProfileObject } from "@/types/userProfileTypes";

export default class TweetRepository implements IGenericTweetRepo {
	private tweetModel: IGenericTweetModel;
	private cache: IGenericCache;
	private emit: SocketEmitter;

	constructor(tweetModel: IGenericTweetModel, cache: IGenericCache, emitter?: SocketEmitter) {
		this.tweetModel = tweetModel;
		this.cache = cache;
		this.emit = emitter;
	}

	public async createTweet(userProfile: IUserProfileObject, tweet: string): Promise<void> {
		try {
			const tweetObj = new this.tweetModel({
				userProfile: userProfile,
				body: tweet,
				comments: [],
				likes: [],
				createdDate: new Date(),
			});
			await tweetObj.save();

			this.emit("POST_CREATED");
		} catch (err) {
			console.error(err);
			throw new Error("Unable to create tweet for user: " + userProfile);
		}

		try {
			// Remove this user's cached feed
			await this.cache.delete(`feed_from_user_${userProfile}`);
			console.log(`Removed ${userProfile}'s feed from the cache as a new tweet was created.`);

			// Remove 'from all' cached feed
			await this.cache.delete("feed_from_all");
			console.log(`Removed 'feed from all' from the cache as a new tweet was created.`);
		} catch (err) {
			console.error(err);
			throw new Error("Unable to invalidate feed cache.");
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

	public async checkFeedFromAll(tweetId: string): Promise<boolean> {
		try {
			const latestTweetId = await this.tweetModel.getLatestTweetId();
			return tweetId === latestTweetId;
		} catch (err) {
			console.error(err);
			throw new Error("Unable to check 'feed from all' from DB.");
		}
	}

	public async getFeedFromUser(userId: string): Promise<ITweetObject[]> {
		const cachedFeed: ITweetObject[] = await this.cache.get(`feed_from_user_${userId}`);
		if (cachedFeed) {
			console.log(`The feed for user: ${userId} was found in cache. Returning cached feed.`);
			return cachedFeed;
		} else {
			try {
				const feed = await this.tweetModel.getFeedFromUser(userId);
				if (feed.length > 0) {
					await this.cache.set(`feed_from_user_${userId}`, feed, { EX: 60 * 60 });
					console.log("Unable to find 'feed_from_all' in the cache. Updating cache. Pulled record from DB.");
				}
				return feed;
			} catch (err) {
				console.error(err);
				throw new Error(`Unable to retrieve 'feed for user' from DB for user: ${userId}`);
			}
		}
	}

	public async toggleLike(tweetId: string, userProfileUsername: string, tweetUserId: string): Promise<void> {
		try {
			// Toggle like
			await this.tweetModel.toggleLikeTweet(tweetId, userProfileUsername);
		} catch (err) {
			console.error(err);
			throw new Error(`Unable to toggle like on tweet for tweetId: ${tweetId} for user: ${userProfileUsername}`);
		}

		try {
			// Invalidate cache for feed and user feed
			await this.cache.delete(`feed_from_user_${tweetUserId}`);
			console.log(`Removed ${tweetUserId}'s feed from the cache as a tweet was liked.`);
			await this.cache.delete("feed_from_all");
			console.log(`Removed 'feed from all' from the cache as a tweet was liked.`);
		} catch (err) {
			console.error(err);
			throw new Error(`Unable to invalidate cache "feed_from_user_${tweetUserId}" or "feed_from_all".`);
		}
	}

	public async postComment(tweetId: string, userProfileUsername: string, comment: string, tweetUserId: string): Promise<void> {
		try {
			// Post comment
			await this.tweetModel.postComment(tweetId, userProfileUsername, comment);
		} catch (err) {
			console.error(err);
			throw new Error(`Unable to post comment on tweet for tweetId: ${tweetId} for user: ${userProfileUsername}`);
		}

		try {
			// Invalidate cache for feed and user feed
			await this.cache.delete(`feed_from_user_${tweetUserId}`);
			console.log(`Removed ${tweetUserId}'s feed from the cache as a comment was posted.`);
			await this.cache.delete("feed_from_all");
			console.log(`Removed 'feed from all' from the cache as a comment was posted.`);
		} catch (err) {
			console.error(err);
			throw new Error(`Unable to invalidate cache "feed_from_user_${tweetUserId}" or "feed_from_all".`);
		}
	}

	public async toggleLikeTweetComment(tweetId: string, commentId: string, userProfileUsername: string, tweetUserId: string): Promise<void> {
		try {
			// Toggle like
			await this.tweetModel.toggleLikeTweetComment(tweetId, commentId, userProfileUsername);
		} catch (err) {
			console.error(err);
			throw new Error(`Unable to toggle like on tweet's comment for tweetId: ${tweetId} for user: ${userProfileUsername}`);
		}

		try {
			// Invalidate cache for feed and user feed
			await this.cache.delete(`feed_from_user_${tweetUserId}`);
			console.log(`Removed ${tweetUserId}'s feed from the cache as a tweet's comment was liked.`);
			await this.cache.delete("feed_from_all");
			console.log(`Removed 'feed from all' from the cache as a tweet's comment was liked.`);
		} catch (err) {
			console.error(err);
			throw new Error(`Unable to invalidate cache "feed_from_user_${tweetUserId}" or "feed_from_all".`);
		}
	}
}
