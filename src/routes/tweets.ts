import { postTweet } from "@/controllers/tweets";
import express from "express";

const router = express.Router();

router.post("/", postTweet);

export default router;
