import mongoose, { Schema } from "mongoose";
import { ITweetMongooseDocument, ITweetMongooseModel, ITweetObject } from "@/types/tweetTypes";

// Schema
const tweetSchema: Schema = new Schema<ITweetMongooseDocument, ITweetMongooseModel>({
	userProfile: {
		type: mongoose.Types.ObjectId,
		ref: "UserProfile",
	},
	body: {
		type: String,
		maxLength: 150,
		minLength: 1,
		required: true,
	},
	comments: [
		{
			userProfile: {
				type: mongoose.Types.ObjectId,
				ref: "UserProfile",
			},
			body: {
				type: String,
				maxLength: 100,
				minLength: 1,
				required: true,
			},
			likes: {
				type: [String], // Array of usernames
			},
		},
	],
	likes: {
		type: [String], // Array of usernames
	},
	createdDate: {
		type: Date,
		default: Date.now(),
	},
});

// Statics
tweetSchema.static("toggleLikeTweet", async function (tweetId: string, userProfileUsername: string) {
	return await this.updateOne({ _id: tweetId }, [
		{
			$set: {
				likes: {
					$cond: [
						{ $in: [userProfileUsername, "$likes"] },
						{ $setDifference: ["$likes", [userProfileUsername]] },
						{ $concatArrays: ["$likes", [userProfileUsername]] },
					],
				},
			},
		},
	]);
});
tweetSchema.static("toggleLikeTweetComment", async function (tweetId: string, commentId: string, userProfileUsername: string) {
	const tweet: any = await this.findOne({ _id: tweetId });
	if (!tweet) throw new Error("No tweet found with id: " + tweetId);

	// Find the comment
	const comment = tweet.comments.findIndex((c: { _id: string }) => c._id === commentId);
	if (!comment) throw new Error("No tweet comment found with id: " + commentId);

	// Check the comment's likes
	const index = comment.likes.findIndex((username: string) => username === userProfileUsername);
	if (index === -1) tweet.comments.likes.push(userProfileUsername);
	else tweet.comments.likes.splice(index, 1);

	console.log(tweet);
	return await tweet.save();
});
// Indexes
tweetSchema.index({ createdDate: -1 });
tweetSchema.index({ userProfile: 1, createdDate: -1 });

export default mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet", tweetSchema);
