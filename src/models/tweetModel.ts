import mongoose, { Schema, ObjectId } from "mongoose";
import { ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweetTypes";
import { IUserProfileMongooseDocument } from "@/types/userProfileTypes";

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
			createdDate: {
				type: Date,
				default: Date.now(),
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
tweetSchema.static("getById", async function (_id: string, lean?: boolean) {
	if (lean) {
		return await this.findById(_id)
			.populate({
				path: "userProfile",
				model: "UserProfile",
				select: "_id username name",
			})
			.populate({
				path: "comments.userProfile",
				model: "UserProfile",
				select: "_id username name",
			})
			.lean();
	}
	return await this.findById(_id)
		.populate({
			path: "userProfile",
			model: "UserProfile",
			select: "_id username name",
		})
		.populate({
			path: "comments.userProfile",
			model: "UserProfile",
			select: "_id username name",
		});
});
tweetSchema.static("getFeedFromAll", async function () {
	// TODO: Pagination at a later date
	return await this.find({})
		.populate({
			path: "userProfile",
			model: "UserProfile",
			select: "_id username name",
		})
		.limit(20)
		.sort({ createdDate: -1 })
		.lean();
});
tweetSchema.static("getFeedFromUser", async function (userId: string) {
	// TODO: Pagination at a later date
	return await this.find({
		userProfile: userId,
	})
		.populate({
			path: "userProfile",
			model: "UserProfile",
			select: "_id username name",
		})
		.limit(20)
		.sort({ createdDate: -1 })
		.lean();
});
tweetSchema.static("getFollowingFeedForUser", async function (following: string[]) {
	// TODO: Pagination at a later date
	const userProfiles = await mongoose.model("UserProfile").find({ username: { $in: following } }, "_id");
	const userProfileIds: string[] = userProfiles.map((profile: IUserProfileMongooseDocument) => profile._id.toString());
	return await this.find({
		userProfile: { $in: userProfileIds },
	})
		.populate({
			path: "userProfile",
			model: "UserProfile",
			select: "_id username name",
		})
		.limit(20)
		.sort({ createdDate: -1 })
		.lean();
});
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
	const comment = tweet.comments.find((c: { _id: string }) => c._id.toString() === commentId);
	if (!comment) throw new Error("No tweet comment found with id: " + commentId);

	// Check the comment's likes & update array
	const index = comment.likes.findIndex((username: string) => username === userProfileUsername);
	if (index === -1) comment.likes.push(userProfileUsername);
	else comment.likes.splice(index, 1);

	return await tweet.save();
});
tweetSchema.static("postComment", async function (tweetId: string, userProfileId: string, comment: string) {
	return await this.updateOne(
		{ _id: tweetId },
		{
			$push: {
				comments: {
					userProfile: userProfileId,
					body: comment,
					likes: [],
					createdDate: new Date(),
				},
			},
		},
	);
});
tweetSchema.static("getLatestTweetId", async function () {
	return await this.findOne({})
		.limit(1)
		.sort({ createdDate: -1 })
		.select("_id")
		.lean()
		.then(({ _id }: { _id: ObjectId }) => _id.toString());
});

// Indexes
tweetSchema.index({ createdDate: -1 });
tweetSchema.index({ userProfile: 1, createdDate: -1 });

export default mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet", tweetSchema);
