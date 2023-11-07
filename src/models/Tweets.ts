import mongoose, { Schema } from "mongoose";
import { ITweetMongooseDocument, ITweetMongooseModel } from "@/types/tweet";

// Schema
const tweetSchema: Schema = new Schema<ITweetMongooseDocument, ITweetMongooseModel>({
	userProfile: {
		type: mongoose.Types.ObjectId,
		ref: "userProfile",
	},
	body: {
		type: String,
		maxLength: 150,
	},
	comments: [
		{
			userProfile: {
				type: mongoose.Types.ObjectId,
				ref: "userProfile",
			},
			body: {
				type: String,
				maxLength: 100,
			},
			likes: {
				type: Number,
				default: 0,
			},
		},
	],
	likes: {
		type: Number,
		default: 0,
	},
	createdDate: {
		type: Date,
		default: Date.now(),
	},
});

// // Hooks
// userSchema.pre("save", function (next) {
// 	if (this.isModified("password")) {
// 		this.password = hashSync(this.password);
// 	}
// 	next();
// });

// // Options
// userSchema.set("toJSON", {
// 	virtuals: true,
// 	transform: (_, obj: IUserMongooseDocument) => {
// 		delete obj.password;
// 		return obj;
// 	},
// });
// userSchema.set("toObject", {
// 	virtuals: true,
// 	transform: (_, obj: IUserMongooseDocument) => {
// 		delete obj.password;
// 		return obj;
// 	},
// });

// // Statics
// userSchema.static("getByUsername", async function (username: string) {
// 	return await this.findOne({ username });
// });

// // Methods
// userSchema.method("comparePassword", function (this: IUserMongooseDocument, password: string) {
// 	return compareSync(password, this.password);
// });

// // Indexes
// userSchema.index({ username: 1 });

// export default mongoose.model<IUserMongooseDocument, IUserMongooseModel>("User", userSchema);
