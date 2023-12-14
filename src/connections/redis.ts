import { IGenericCache } from "@/types/cacheTypes";
import { createClient, RedisClientType } from "redis";

let CLIENT: RedisClientType | undefined;
let CLIENT_LISTENER: RedisClientType | undefined;

export const connectToRedis = async () => {
	try {
		console.log("Attempting to connect to Redis...");
		CLIENT = createClient({
			socket: {
				host: process.env.REDIS_HOST,
				port: parseInt(process.env.REDIS_PORT),
			},
			password: process.env.REDIS_PASSWORD,
		});
		await CLIENT.connect();
		CLIENT_LISTENER = CLIENT.duplicate();
		await CLIENT_LISTENER.connect();
		console.log("✅ Connected to Redis successfully.");
	} catch (err) {
		console.error(err.message);
		console.error("❌ Failed to connect to Redis.");
	}
};

// Generic Adapter
export const redisClient: IGenericCache = {
	get: async (key: string) => {
		try {
			if (!CLIENT) throw new Error("No Redis connection available.");
			const result = await CLIENT.get(key);
			return JSON.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	},
	set: async <T>(key: string, payload: T) => {
		try {
			if (!CLIENT) throw new Error("No Redis connection available.");
			const result = await CLIENT.set(key, JSON.stringify(payload));
			return result;
		} catch (err) {
			console.error(err);
			return null;
		}
	},
};

// Redis event publisher
export const emitRedisEvent = <T>(eventName: string, payload: T) => {
	if (!CLIENT || !CLIENT_LISTENER) throw new Error("No Redis connection available.");
	const payloadString: string = typeof payload === "string" ? payload : JSON.stringify(payload);
	CLIENT.publish(eventName, payloadString);
};

// Redis event subscription handler
export const listenToRedisEvent = async (eventName: string, callback: (message: string) => void) => {
	if (!CLIENT || !CLIENT_LISTENER) throw new Error("No Redis connection available.");

	await CLIENT_LISTENER.subscribe(eventName, (message: string) => {
		callback(JSON.parse(message));
	});
};
