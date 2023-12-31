import { getFeedFromAll } from "@/controllers/feedController";
import express from "express";

const router = express.Router();

// POST
// router.post("/", postTweet);

// // PATCH
// router.patch("/:tweetId/comment", postComment);
// router.patch("/:tweetId/like", likeTweet);
// router.patch("/:tweetId/comment/:commentId/like", likeTweetComment);

// GET
router.get("/fromAll", getFeedFromAll);

export default router;
