import { getFeedFromAll } from "@/controllers/feedController";
import express from "express";

const router = express.Router();

// GET
router.get("/fromAll", getFeedFromAll);

export default router;
