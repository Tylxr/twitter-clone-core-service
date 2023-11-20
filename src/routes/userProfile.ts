import { createProfile, deleteProfile } from "@/controllers/userProfile";
import express from "express";

const router = express.Router();

router.post("/", createProfile);
router.delete("/", deleteProfile);

export default router;
