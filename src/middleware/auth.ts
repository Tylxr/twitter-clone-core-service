import { Request, Response, NextFunction } from "express";
import { INetworkRequestInstance } from "@/types/network";

export default function Auth(authNetworkInstance: INetworkRequestInstance) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization && req.headers.authorization.split("Bearer ")?.[1];
			if (!token) {
				throw Error("No bearer token supplied.");
			}
			if (token === process.env.CORE_SERVER_TOKEN) {
				console.log("Skipping auth request - server token provided.");
				return next();
			}
			const response = await authNetworkInstance.post(
				"/authenticated",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response && response.status === 200) next();
			else return res.status(401).send({ errorMessage: "Authentication failed." });
		} catch (err) {
			console.error(err.message);
			return res.status(401).send({ errorMessage: err.message || "Authentication failed." });
		}
	};
}
