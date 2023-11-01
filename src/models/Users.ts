import { hashSync, compareSync } from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { IUserMongooseModel, IUserMongooseDocument } from "../types/user";

// Schema
const userSchema: Schema = new Schema<IUserMongooseDocument, IUserMongooseModel>({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

// Hooks
userSchema.pre("save", function (next) {
	if (this.isModified("password")) {
		this.password = hashSync(this.password);
	}
	next();
});

// Options
userSchema.set("toJSON", {
	virtuals: true,
	transform: (_, obj: IUserMongooseDocument) => {
		delete obj.password;
		return obj;
	},
});
userSchema.set("toObject", {
	virtuals: true,
	transform: (_, obj: IUserMongooseDocument) => {
		delete obj.password;
		return obj;
	},
});

// Statics
userSchema.static("getByUsername", async function (username: string) {
	return await this.findOne({ username });
});

// Methods
userSchema.method("comparePassword", function (this: IUserMongooseDocument, password: string) {
	return compareSync(password, this.password);
});

// Indexes
userSchema.index({ username: 1 });

export default mongoose.model<IUserMongooseDocument, IUserMongooseModel>("User", userSchema);
