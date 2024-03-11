import { listenToServer } from "@/connections/socketio";

export default () => {
	listenToServer("POST_CREATED", (payload) => {
		console.log("A new post was created.");
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
	});
};
