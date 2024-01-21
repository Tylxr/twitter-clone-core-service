import mongoose, { Schema } from "mongoose";
import { IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfileTypes";

// Schema
const userProfileSchema: Schema = new Schema<IUserProfileMongooseDocument, IUserProfileMongooseModel>({
	username: {
		type: String,
		unique: true,
		minLength: 4,
		maxLength: 25,
		required: true,
	},
	name: {
		type: String,
		minLength: 4,
		maxLength: 25,
		required: true,
	},
	bio: {
		type: String,
		maxLength: 200,
	},

	// Type of [String] avoids the case where we would have millions of user profiles populated for
	// a user. This forces us to manually lookup followers/following accounts when they are needed,
	// which is an operation that isn't as popular and can be paginated if needed.
	followers: {
		type: [String],
	},
	following: {
		type: [String],
	},
	createdDate: {
		type: Date,
		default: Date.now(),
	},
});

// Statics
userProfileSchema.static("getIdByUsername", async function (username: string): Promise<string | undefined> {
	const doc: IUserProfileMongooseDocument = await this.findOne({ username }, { _id: 1 });
	return doc ? doc._id.toString() : undefined;
});
userProfileSchema.static("getByUsername", async function (username: string, lean: boolean = false) {
	if (lean) return await this.findOne({ username }).lean();
	return await this.findOne({ username });
});
userProfileSchema.static("deleteByUsername", async function (username: string) {
	return await this.deleteOne({ username });
});
userProfileSchema.static("toggleFollow", async function (userToFollow: string, userProfileUsername: string) {
	return await Promise.all([
		// Update 'following' of this user profile
		this.updateOne(
			{
				username: userProfileUsername,
			},
			[
				{
					$set: {
						following: {
							$cond: [
								{ $in: [userToFollow, "$following"] },
								{ $setDifference: ["$following", [userToFollow]] },
								{ $concatArrays: ["$following", [userToFollow]] },
							],
						},
					},
				},
			],
		),

		// Update 'followers' of target user profile
		this.updateOne(
			{
				username: userToFollow,
			},
			[
				{
					$set: {
						followers: {
							$cond: [
								{ $in: [userProfileUsername, "$followers"] },
								{ $setDifference: ["$followers", [userProfileUsername]] },
								{ $concatArrays: ["$followers", [userProfileUsername]] },
							],
						},
					},
				},
			],
		),
	]);
});

// Indexes
userProfileSchema.index({ username: 1 });

export default mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile", userProfileSchema);
