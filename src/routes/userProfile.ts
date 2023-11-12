import { createProfile, deleteProfile } from "@/controllers/userProfile";
import express from "express";

export default function (router: express.IRouter) {
	router.post("/", createProfile);
	router.delete("/", deleteProfile);

	return router;
}
