import { likeTweetComment, likeTweet, postComment, postTweet, getTweet } from "@/controllers/tweetsController";
import express from "express";

const router = express.Router();

// POST
router.post("/", postTweet);

// PATCH
router.patch("/:tweetId/comment", postComment);
router.patch("/:tweetId/like", likeTweet);
router.patch("/:tweetId/comment/:commentId/like", likeTweetComment);

// GET
router.get("/:tweetId", getTweet);

export default router;
