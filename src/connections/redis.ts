import { createClient } from "redis";

let redisClient;

export const connectToRedis = async () => {
	try {
		console.log("Attempting to connect to Redis...");
		redisClient = createClient({
			socket: {
				host: process.env.REDIS_HOST,
				port: parseInt(process.env.REDIS_PORT),
			},
			password: process.env.REDIS_PASSWORD,
		});
		await redisClient.connect();
		console.log("✅ Connected to Redis successfully.");
	} catch (err) {
		console.error(err.message);
		console.error("❌ Failed to connect to Redis.");
	}
};

export { redisClient };
