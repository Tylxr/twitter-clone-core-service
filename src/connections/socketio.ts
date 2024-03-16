import http from "http";
import { Server, Socket as Socket } from "socket.io";

let socketio: Socket | undefined;
let io: Server | undefined;

export default (server: http.Server) => {
	io = new Server(server, {
		cors: {
			origin: process.env.CLIENT_BASE_URL,
		},
	});

	io.use((socket, next) => {
		console.log("Running socket.io middleware");
		// TODO: Implement auth middleware
		next();
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
