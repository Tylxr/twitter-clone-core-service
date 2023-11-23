import mongoose, { Schema } from "mongoose";
import { ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweetTypes";

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
				type: Number,
				default: 0,
				min: 0,
			},
		},
	],
	likes: {
		type: Number,
		default: 0,
		min: 0,
	},
	createdDate: {
		type: Date,
		default: Date.now(),
	},
});

// Indexes
tweetSchema.index({ createdDate: -1 });
tweetSchema.index({ userProfile: 1, createdDate: -1 });

export default mongoose.model<ITweetMongooseDocument, ITweetMongooseModel>("Tweet", tweetSchema);
