import { Schema } from "mongoose";
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
