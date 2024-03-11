import http from "http";
import { Server, Socket as Socket } from "socket.io";
import { io, Socket as ServerSocket } from "socket.io-client";
import loadSocketListeners from "@/sockets";

let socketio: Socket | undefined;
let serverSocketConnection: ServerSocket | undefined;

export default (server: http.Server) => {
	console.log("✅ Initialising SocketIO connection.");

	serverSocketConnection = io(process.env.CORE_BASE_URL, {
		reconnectionDelayMax: 10000,
	});

	const ioInstance = new Server(server);

	ioInstance.on("connection", (socket) => {
		console.log("A new socket connection was established.");
		socketio = socket;
	});

	loadSocketListeners();
};

export const emit = (name: string, payload?: any) => {
	try {
		if (!socketio) throw new Error("No socket connection available.");

		// Very basic emit event. Can extend functionality in the future.
		socketio.emit(name, payload);
	} catch (err) {
		console.error(err);
	}
};

export const listen = (name: string, cb: (payload: any) => void) => {
	try {
		if (!socketio) throw new Error("No socket connection available.");

		// Very basic listener. Can extend functionality in the future.
		socketio.on(name, cb);
	} catch (err) {
		console.error(err);
	}
};

export const listenToServer = (name: string, cb: (payload: any) => void) => {
	try {
		if (!serverSocketConnection) throw new Error("No SERVER socket connection available.");

		// Very basic listener. Can extend functionality in the future.
		serverSocketConnection.on(name, cb);
	} catch (err) {
		console.error(err);
	}
};
