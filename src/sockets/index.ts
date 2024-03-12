import { getEmitter } from "@/connections/events";
import { emitSocket } from "@/connections/socketio";

export default () => {
	const emitter = getEmitter();

	emitter.on("POST_CREATED", () => {
		emitSocket("FOLLOWING_FEED_UPDATED", [{ a: 1 }, { a: 2 }]);
	});

	// listenToServer("POST_CREATED", (payload) => {
	/*
	    TODO:
	    Now that a post has been created, we need to re-run some logic to get the following feed.
	    Once we have the following feed, we will emit an event which the frontend will be listening to
	    that contains the feed as the payload.
	    So the steps...
	        1) Call a controller method
	        2) The controller method will initialise the concretions
	        3) These concretions will then be used to retrieve the following feed for the user and returned to this function
	        4) The feed will be the payload of an event that will be emitted to the frontend
	*/
	// emit("FOLLOWING_FEED_UPDATED", [{ a: 1 }, { a: 2 }]);
	// });
};
