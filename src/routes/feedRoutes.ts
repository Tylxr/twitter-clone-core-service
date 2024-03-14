import { checkFeedFromAll, getFeedFromAll, getFeedFromFollowing, getFeedFromUser } from "@/controllers/feedController";
import express from "express";

const router = express.Router();

// GET
router.get("/fromAll", getFeedFromAll);
router.get("/fromUser/:username", getFeedFromUser);
router.get("/fromFollowing", getFeedFromFollowing);

// POST
router.post("/fromAll/check", checkFeedFromAll);

export default router;
