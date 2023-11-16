import mongoose, { ObjectId, Schema } from "mongoose";
import { IUserProfileMongooseDocument, IUserProfileMongooseModel } from "@/types/userProfile";

// Schema
const userProfileSchema: Schema = new Schema<IUserProfileMongooseDocument, IUserProfileMongooseModel>({
	username: {
		type: String,
		unique: true,
		minLength: 4,
		maxLength: 25,
		required: true,
	},
	bio: {
		type: String,
		maxLength: 200,
	},

	// Type of [String] avoids the case where we would have millions of user profiles populated for
	// a user. This forces us to manually lookup followers/following accounts when they are needed.
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
userProfileSchema.static("getByUsername", async function (username: string) {
	return await this.findOne({ username });
});
userProfileSchema.static("deleteByUsername", async function (username: string) {
	return await this.deleteOne({ username });
});

// Indexes
userProfileSchema.index({ username: 1 });

export default mongoose.model<IUserProfileMongooseDocument, IUserProfileMongooseModel>("UserProfile", userProfileSchema);
