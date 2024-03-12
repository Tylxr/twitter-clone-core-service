import "dotenv/config";
import app from "./src/app";
import http from "http";
import connectToMongoose from "@/connections/mongoose";
import connectToRedis from "@/connections/redis";
import initialiseSocketIO from "@/connections/socketio";
import initialiseEmitter from "@/connections/events";

const port = process.env.PORT || "4000";
const server = http.createServer(app);

// Initialise socket.io
initialiseSocketIO(server);

// Initialise node events
initialiseEmitter();

// Initialise server
server.listen(port, async () => {
	console.log(`Core Service listening on port ${port}.`);
	await connectToMongoose();
	await connectToRedis();
});

server.on("error", (err) => console.error(err));
