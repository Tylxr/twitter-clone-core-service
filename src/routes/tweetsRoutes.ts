import express from "express";
import { likeTweetComment, likeTweet, postComment, postTweet, getTweet } from "@/controllers/tweetsController";
import tweetIdMiddleware from "@/middleware/tweetId";

const router = express.Router();

// POST
router.post("/", postTweet);

// PATCH
router.patch("/:tweetId/comment", tweetIdMiddleware, postComment);
router.patch("/:tweetId/like", tweetIdMiddleware, likeTweet);
router.patch("/:tweetId/comment/:commentId/like", tweetIdMiddleware, likeTweetComment);

// GET
router.get("/:tweetId", getTweet);

export default router;
