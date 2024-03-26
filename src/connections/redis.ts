import { IGenericCache } from "@/types/miscTypes";
import { createClient, RedisClientType, SetOptions } from "redis";

let CLIENT: RedisClientType | undefined;
let CLIENT_LISTENER: RedisClientType | undefined;

export default async () => {
	try {
		console.log("Attempting to connect to Redis...");

		const socketOpts: { [key: string]: string | number } = {
			host: process.env.REDIS_HOST,
		};

		if (process.env.NODE_ENV === "local") {
			socketOpts["port"] = parseInt(process.env.REDIS_PORT);
		}

		CLIENT = createClient({
			// legacyMode: true,
			socket: socketOpts,
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
			return result ? JSON.parse(result) : undefined;
		} catch (err) {
			console.error(err);
			return null;
		}
	},
	set: async <T, J extends SetOptions>(key: string, payload: T, options?: J) => {
		try {
			if (!CLIENT) throw new Error("No Redis connection available.");
			const result = await CLIENT.set(key, JSON.stringify(payload), options);
			return result;
		} catch (err) {
			console.error(err);
			return null;
		}
	},
	emit: <T>(eventName: string, payload: T) => emitRedisEvent(eventName, payload),
	listen: async (eventName: string, cb: (message: string) => void) => await listenToRedisEvent(eventName, cb),
	delete: async (key: string) => {
		try {
			await CLIENT.del(key);
			return true;
		} catch (err) {
			console.error(err);
			return false;
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
		callback(message ? JSON.parse(message) : undefined);
	});
};
