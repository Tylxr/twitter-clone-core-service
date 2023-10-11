import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get("/", function (req: Request, res: Response, next: NextFunction) {
	res.send({ success: true });
});

export default router;
