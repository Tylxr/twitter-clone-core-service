import mongoose from "mongoose";

export default async () => {
	try {
		const mongoDBConnectionString = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}${
			process.env.NODE_ENV === "local" ? ":" + process.env.MONGODB_PORT : ""
		}/${process.env.MONGODB_DB}?authSource=admin`;
		console.log("Attempting to connect to mongo instance...");
		await mongoose.connect(mongoDBConnectionString);
		console.log("✅ Connected to MongoDB successfully via Mongoose.");
	} catch (err) {
		console.error(err.message);
		console.error("❌ Failed to connect to MongoDB via Mongoose.");
	}
};
