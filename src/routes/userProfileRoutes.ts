import { createProfile, deleteProfile, retrieveProfile } from "@/controllers/userProfileController";
import express from "express";

const router = express.Router();

router.post("/", createProfile);
router.delete("/", deleteProfile);

router.get("/:username", retrieveProfile);

/**
 * I should implement pub/sub pattern for cache invalidation.
 * When I write the PATCH /userProfile route, I will implement it. I can publish the event
 * and listen to it in the services file - maybe a new 'eventsService.ts' file that's imported
 * somewhere more global, maybe app.ts.
 */

export default router;
