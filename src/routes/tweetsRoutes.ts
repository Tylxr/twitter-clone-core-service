import { postTweet } from "@/controllers/tweetsController";
import express from "express";

const router = express.Router();

// POST
router.post("/", postTweet);

export default router;
