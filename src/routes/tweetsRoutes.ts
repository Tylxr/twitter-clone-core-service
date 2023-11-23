import { postTweet } from "@/controllers/tweetsController";
import express from "express";

const router = express.Router();

router.post("/", postTweet);

export default router;
