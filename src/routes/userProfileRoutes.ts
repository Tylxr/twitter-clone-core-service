import { createProfile, deleteProfile, retrieveProfile, updateProfile } from "@/controllers/userProfileController";
import express from "express";

const router = express.Router();

// POST
router.post("/", createProfile);

// GET
router.get("/:username", retrieveProfile);

// PATCH
router.patch("/", updateProfile);
router.patch('/follow/:username', )

// DELETE
router.delete("/", deleteProfile);

export default router;
