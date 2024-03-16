import http from "http";
import { Server, Socket as Socket } from "socket.io";
import ensureAuthenticated from "@/middleware/auth";
import authInstance from "./authInstance";
import { AuthenticationMiddlewareResponse } from "@/types/networkTypes";

let socketio: Socket | undefined;
let io: Server | undefined;

export default (server: http.Server) => {
	io = new Server(server, {
		cors: {
			origin: process.env.CLIENT_BASE_URL,
		},
	});

	// Authentication middleware
	io.use(async (socket, next) => {
		const { token } = socket.handshake.auth;
		const response: AuthenticationMiddlewareResponse = await ensureAuthenticated(token, authInstance);

		if (response.authenticated) {
			next();
		} else {
			console.error("User not authenticated with socket instance.");
			next(new Error(response.errorMessage || "Authentication failed."));
		}
	});

	io.on("connection", (socket) => {
		// Store the socket for later use
		socketio = socket;
	});
};

export const emitSocket = (name: string, payload?: any) => {
	try {
		if (!socketio) throw new Error("No socket connection available.");

		// Very basic emit event. Can extend functionality in the future.
		io.sockets.emit(name, payload);
	} catch (err) {
		console.error(err);
	}
};

export const listenSocket = (name: string, cb: (payload: any) => void) => {
	try {
		if (!socketio) throw new Error("No socket connection available.");

		// Very basic listener. Can extend functionality in the future.
		socketio.on(name, cb);
	} catch (err) {
		console.error(err);
	}
};
