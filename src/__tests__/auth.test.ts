import authenticateMiddleware from "../middleware/auth";

// Mocking the dependencies
const mockToken = "mockToken";
const mockAuthNetworkInstance = {
	post: jest.fn(),
	get: jest.fn(),
	delete: jest.fn(),
};

beforeEach(() => {
	// Ignore errors thrown purposely from inside functions that are being tested
	jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Authentication - Middleware", () => {
	it("Should return authenticated as true if admin token is provided", async () => {
		const adminToken = process.env.CORE_SERVER_TOKEN;
		const result = await authenticateMiddleware(adminToken, mockAuthNetworkInstance);
		expect(result.authenticated).toBe(true);
		expect(result.error).toBe(false);
		expect(result.errorMessage).toBe("");
		expect(result.data).toBeNull();
		expect(mockAuthNetworkInstance.post).not.toHaveBeenCalled();
	});

	it("Should return authentication failed if no token is provided", async () => {
		const token = "";
		const result = await authenticateMiddleware(token, mockAuthNetworkInstance);
		expect(result.authenticated).toBe(false);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("No bearer token supplied.");
		expect(result.data).toBeNull();
		expect(mockAuthNetworkInstance.post).not.toHaveBeenCalled();
	});

	it("Should return authentication failed if authentication request fails", async () => {
		mockAuthNetworkInstance.post.mockRejectedValueOnce(new Error("Network Error"));
		const result = await authenticateMiddleware(mockToken, mockAuthNetworkInstance);
		expect(result.authenticated).toBe(false);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Authentication failed.");
		expect(result.data).toBeNull();
		expect(mockAuthNetworkInstance.post).toHaveBeenCalledTimes(1);
		expect(mockAuthNetworkInstance.post).toHaveBeenCalledWith(
			"/authenticated",
			{},
			{
				headers: {
					Authorization: `Bearer ${mockToken}`,
				},
			},
		);
	});

	it("Should return authenticated as true and username if authentication is successful", async () => {
		const mockResponse = {
			status: 200,
			data: {
				tokenPayload: {
					username: "mockUser",
				},
			},
		};
		mockAuthNetworkInstance.post.mockResolvedValueOnce(mockResponse);
		const result = await authenticateMiddleware(mockToken, mockAuthNetworkInstance);
		expect(result.authenticated).toBe(true);
		expect(result.error).toBe(false);
		expect(result.errorMessage).toBe("");
		expect(result.data).toEqual({
			username: "mockuser",
		});
		expect(mockAuthNetworkInstance.post).toHaveBeenCalledTimes(1);
		expect(mockAuthNetworkInstance.post).toHaveBeenCalledWith(
			"/authenticated",
			{},
			{
				headers: {
					Authorization: `Bearer ${mockToken}`,
				},
			},
		);
	});
});
