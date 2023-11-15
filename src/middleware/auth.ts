import { Request, Response, NextFunction } from "express";
import { INetworkRequestInstance } from "@/types/network";
import { IGenericUserProfileModel } from "@/types/userProfile";

export default function Auth<T extends { tokenPayload: { username: string } }>(authNetworkInstance: INetworkRequestInstance<T>, userProfileModel: IGenericUserProfileModel) {
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

			if (response && response.status === 200) {
                if (req.userProfile && req.userProfile !== response.data.tokenPayload.username) {
                    req.userProfile = response.data.tokenPayload.username;
                    req.userProfileId = await userProfileModel.getIdByUsername(response.data.tokenPayload.username);
                }
				next();
			} else {
				return res.status(401).send({ errorMessage: "Authentication failed." });
			}
		} catch (err) {
			console.error(err.message);
			return res.status(401).send({ errorMessage: err.message || "Authentication failed." });
		}
	};
}
