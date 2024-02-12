import { Request, Response, NextFunction } from "express";
import { INetworkRequestInstance } from "@/types/networkTypes";
import { IGenericUserProfileModel } from "@/types/userProfileTypes";

export default function Auth<T extends { tokenPayload: { username: string } }>(
	authNetworkInstance: INetworkRequestInstance<T>,
	userProfileModel: IGenericUserProfileModel,
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization && req.headers.authorization.split("Bearer ")?.[1];
			if (!token) {
				throw new Error("No bearer token supplied.");
			}
			if (token === process.env.CORE_SERVER_TOKEN) {
				// TODO: Check origin as well for added security
				console.log("Skipping auth request - admin token provided.");
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

			if (response && response.status === 200) {
				if (req.userProfileUsername !== response.data.tokenPayload.username) {
					req.userProfileUsername = response.data.tokenPayload.username?.toLowerCase();
					req.userProfile = await userProfileModel.getByUsername(response.data.tokenPayload.username, true);
				}
				next();
			} else {
				return res.status(401).send({ errorMessage: "Authentication failed." });
			}
		} catch (err) {
			console.error(err.message);
			return res.status(401).send({ errorMessage: "Authentication failed." });
		}
	};
}
