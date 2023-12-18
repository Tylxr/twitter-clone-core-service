import { createProfile, deleteProfile, retrieveProfile, toggleFollow, updateProfile } from "@/controllers/userProfileController";
import express from "express";

const router = express.Router();

// POST
router.post("/", createProfile);

// GET
router.get("/:username", retrieveProfile);

// PATCH
router.patch("/", updateProfile);
router.patch("/follow/:username", toggleFollow);

// DELETE
router.delete("/", deleteProfile);

export default router;
