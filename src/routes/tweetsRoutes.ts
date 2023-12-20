import { likeComment, likeTweet, postComment, postTweet } from "@/controllers/tweetsController";
import express from "express";

const router = express.Router();

// POST
router.post("/", postTweet);

// PATCH
router.patch("/:tweetId/comment", postComment);
router.patch("/:tweetId/like", likeTweet);
router.patch("/:tweetId/comment/:commentId/like", likeComment);

export default router;
