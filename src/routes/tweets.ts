import { postTweet } from "@/controllers/tweets";
import express from "express";

export default function (router: express.IRouter) {
	router.post("/", postTweet);

	return router;
}
