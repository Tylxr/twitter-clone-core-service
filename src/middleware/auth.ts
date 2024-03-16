import { AuthenticationMiddlewareResponse, INetworkRequestInstance } from "@/types/networkTypes";

export default async <T extends { tokenPayload: { username: string } }>(
	token: string,
	authNetworkInstance: INetworkRequestInstance<T>,
): Promise<AuthenticationMiddlewareResponse> => {
	try {
		if (!token) {
			throw new Error("No bearer token supplied.");
		}
		if (token === process.env.CORE_SERVER_TOKEN) {
			console.log("Skipping auth request - admin token provided.");
			return { authenticated: true, error: false, errorMessage: "", data: null };
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
			return {
				authenticated: true,
				error: false,
				errorMessage: "",
				data: {
					username: response.data.tokenPayload.username?.toLowerCase(),
				},
			};
		} else {
			return { authenticated: false, error: true, errorMessage: "Authentication failed.", data: null };
		}
	} catch (err) {
		console.error(`Authentication via auth middleware failed - ${err.message}.`);
		return { authenticated: false, error: true, errorMessage: "Authentication failed.", data: null };
	}
};
