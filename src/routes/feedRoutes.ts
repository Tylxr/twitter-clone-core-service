import { checkFeedFromAll, getFeedFromAll, getFeedFromUser } from "@/controllers/feedController";
import express from "express";

const router = express.Router();

// GET
router.get("/fromAll", getFeedFromAll);
router.get("/fromUser/:username", getFeedFromUser);

// POST
router.post("/fromAll/check", checkFeedFromAll);

export default router;
