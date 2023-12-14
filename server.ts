import "dotenv/config";
import app from "./src/app";
import http from "http";
import connectToMongoose from "@/connections/mongoose";
import { connectToRedis, emitRedisEvent } from "@/connections/redis";

const port = process.env.PORT || "4000";
const server = http.createServer(app);

server.listen(port, async () => {
	console.log(`Core Service listening on port ${port}.`);
	await connectToMongoose();
	await connectToRedis();
});
server.on("error", (err) => console.error(err));
