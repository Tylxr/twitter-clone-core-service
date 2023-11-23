import { createProfile, deleteProfile, retrieveProfile } from "@/controllers/userProfileController";
import express from "express";

const router = express.Router();

router.post("/", createProfile);
router.delete("/", deleteProfile);

router.get('/:username', retrieveProfile);

export default router;
