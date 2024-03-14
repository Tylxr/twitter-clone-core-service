import { getEmitter } from "@/connections/events";
import { emitSocket } from "@/connections/socketio";
import { fromFollowing } from "@/services/feedService";
import { IFeedResponse } from "@/types/networkTypes";
import { ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweetTypes";
import { IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfileTypes";
import mongoose from "mongoose";

export default () => {
	const emitter = getEmitter();

	if (emitter.listenerCount("POST_CREATED") === 0) {
		emitter.on("POST_CREATED", async (userId: string) => {
			console.log("userId", userId);
			if (!userId) {
				throw new Error("No userId supplied for POST_CREATED event.");
			}

			const userProfileModel: IUserProfileMongooseModel = mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile");
			const tweetModel: ITweetMongooseModel = mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet");
			try {
				const response: IFeedResponse = await fromFollowing(tweetModel, userProfileModel, userId);
				if (!response.error) {
					emitSocket("FOLLOWING_FEED_UPDATED", response.feed);
				} else {
					console.error(response.errorMessage);
				}
			} catch (err) {
				console.error(err);
			}
		});
	}
};
