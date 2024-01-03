import { getFeedFromAll, getFeedFromUser } from "@/controllers/feedController";
import express from "express";

const router = express.Router();

// GET
router.get("/fromAll", getFeedFromAll);
router.get("/fromUser/:username", getFeedFromUser);

export default router;
