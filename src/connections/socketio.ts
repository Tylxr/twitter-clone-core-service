import http from "http";
import { Server, Socket as Socket } from "socket.io";
import loadSockets from "@/sockets";

let socketio: Socket | undefined;

export default (server: http.Server) => {
	const ioServer = new Server(server, {
		cors: {
			origin: process.env.CLIENT_BASE_URL,
		},
	});

	ioServer.on("connection", (socket) => {
		// Store the socket for later use
		socketio = socket;
		loadSockets();
	});
};

export const emitSocket = (name: string, payload?: any) => {
	try {
		if (!socketio) throw new Error("No socket connection available.");

		// Very basic emit event. Can extend functionality in the future.
		socketio.emit(name, payload);
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
