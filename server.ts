import "dotenv/config";
import app from "./src/app";
import http from "http";
import mongoose from "mongoose";

const port = process.env.PORT || "4000";
const server = http.createServer(app);

server.listen(port, async () => {
	console.log(`Core Service listening on port ${port}.`);
	console.log(`Attempting to connect to mongo instance...`);

	try {
		const mongoDBConnectionString = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DB}?authSource=admin`;
		await mongoose.connect(mongoDBConnectionString);
		console.log("✅ Connected to MongoDB successfully via Mongoose.");
	} catch (err) {
		console.error("❌ Failed to connect to MongoDB via Mongoose.");
		console.error(err);
	}
});
server.on("error", (err) => console.error(err));
