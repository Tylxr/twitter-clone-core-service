import { Request, Response, NextFunction } from "express";
import authInstance from "@/utils/authInstance";

export default async function Auth(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.headers.authorization && req.headers.authorization.split("Bearer ")?.[1];
		if (!token) {
			throw Error("No bearer token supplied.");
		}
		const response = await authInstance().post(
			"/authenticated",
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (response && response.status === 200) next();
		else return res.status(401).send({ message: "Authentication failed." });
	} catch (err) {
		console.error(err.message);
		return res.status(401).send({ message: err.message || "Authentication failed." });
	}
}
