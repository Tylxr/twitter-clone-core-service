import "dotenv/config";
import app from "./src/app";
import http from "http";
import mongoose from "mongoose";
import { createClient } from "redis";

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
		console.error(err.message);
		console.error("❌ Failed to connect to MongoDB via Mongoose.");
	}

	try {
		console.log("Attempting to connect to redis...");
		const client = createClient({
			socket: {
				host: process.env.REDIS_HOST,
				port: parseInt(process.env.REDIS_PORT),
			},
			password: process.env.REDIS_PASSWORD,
		});
		await client.connect();
		console.log("✅ Connected to Redis successfully.");
	} catch (err) {
		console.error(err.message);
		console.error("❌ Failed to connect to Redis.");
	}
});
server.on("error", (err) => console.error(err));
