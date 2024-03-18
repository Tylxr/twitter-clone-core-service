import { fromAll, checkFromAll, fromUser, fromFollowing } from "../services/feedService";
import { mockTweetRepo } from "./mocks";

// Mocked dependencies
const validId = "123";

beforeEach(() => {
	// Ignore errors thrown purposely from inside functions that are being tested
	jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Feed From All - FeedService", () => {
	it("Should call getFeedFromAll correctly", () => {
		fromAll(mockTweetRepo);
		expect(mockTweetRepo.getFeedFromAll).toHaveBeenCalledTimes(1);
		expect(mockTweetRepo.getFeedFromAll).toHaveBeenCalledWith();
	});

	it("Should error gracefully when an error is thrown", async () => {
		mockTweetRepo.getFeedFromAll.mockImplementationOnce(() => {
			throw new Error("error");
		});

		const result = await fromAll(mockTweetRepo);
		expect(result).toHaveProperty("error");
		expect(result).toHaveProperty("errorMessage");
		expect(result).toHaveProperty("feed");
		expect(result.error).toBe(true);
	});

	it("Should return a twitter feed", async () => {
		const result = await fromAll(mockTweetRepo);

		expect(result).toHaveProperty("feed");
		expect(Array.isArray(result.feed)).toBe(true);
		expect(result).not.toHaveProperty("errorMessage");
		expect(result.error).toBe(false);
	});
});

describe("Check From All - FeedService", () => {
	it("Should error if no tweetId is provided", async () => {
		const result = await checkFromAll(mockTweetRepo, "");
		expect(result).toHaveProperty("error");
		expect(result).toHaveProperty("errorMessage");
		expect(result.error).toBe(true);
		expect(result).not.toHaveProperty("latest");
		expect(result.errorMessage).toBe("No tweetId provided.");
	});

	it("Should error gracefully when an error is thrown", async () => {
		mockTweetRepo.checkFeedFromAll.mockImplementationOnce(() => {
			throw new Error("error");
		});

		const result = await checkFromAll(mockTweetRepo, validId);
		expect(result).toHaveProperty("error");
		expect(result).toHaveProperty("errorMessage");
		expect(result.error).toBe(true);
		expect(result).not.toHaveProperty("latest");
		expect(result.errorMessage).toBe("Error checking feed from all.");
	});

	it("Should return a property called 'latest'", async () => {
		const result = await checkFromAll(mockTweetRepo, validId);
		expect(result).toHaveProperty("latest");
		expect(typeof result.latest).toBe("boolean");
		expect(result.error).toBe(false);
	});
});

describe("Feed From User - FeedService", () => {
	it("Should error if no userId is provided", async () => {
		const result = await fromUser(mockTweetRepo, "");
		expect(result).toHaveProperty("error");
		expect(result).toHaveProperty("errorMessage");
		expect(result.error).toBe(true);
		expect(result.feed).toHaveLength(0);
		expect(result.errorMessage).toBe("Invalid userId provided.");
	});

	it("Should error gracefully when an error is thrown", async () => {
		mockTweetRepo.getFeedFromUser.mockImplementationOnce(() => {
			throw new Error("error");
		});

		const result = await fromUser(mockTweetRepo, validId);
		expect(result).toHaveProperty("error");
		expect(result).toHaveProperty("errorMessage");
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Error getting feed from user.");
	});

	it("Should return a twitter feed", async () => {
		const result = await fromUser(mockTweetRepo, validId);

		expect(mockTweetRepo.getFeedFromUser).toHaveBeenCalledTimes(1);
		expect(mockTweetRepo.getFeedFromUser).toHaveBeenCalledWith(validId);
		expect(result).not.toHaveProperty("errorMessage");
		expect(result).toHaveProperty("error");
		expect(result.error).toBe(false);
		expect(result).toHaveProperty("feed");
	});
});

describe("Feed From Following - FeedService", () => {
	const mockGetFollowingListByUserId = jest.fn().mockImplementation(() => ["a", "b"]);
	const mockGetFollowingFeedForUser = jest.fn().mockImplementation(() => [{}, {}]);

	it("Should error if no userId is provided", async () => {
		const result = await fromFollowing(mockGetFollowingListByUserId, mockGetFollowingFeedForUser, "");
		expect(mockGetFollowingListByUserId).not.toHaveBeenCalled();
		expect(mockGetFollowingListByUserId).not.toHaveBeenCalled();
		expect(result).toHaveProperty("error");
		expect(result).toHaveProperty("errorMessage");
		expect(result.error).toBe(true);
		expect(result.feed).toHaveLength(0);
		expect(result.errorMessage).toBe("Invalid userId provided.");
	});

	it("Should call the underlying functions properly", async () => {
		const result = await fromFollowing(mockGetFollowingListByUserId, mockGetFollowingFeedForUser, validId);
		expect(mockGetFollowingListByUserId).toHaveBeenCalledTimes(1);
		expect(mockGetFollowingListByUserId).toHaveBeenCalledWith(validId);
		expect(mockGetFollowingFeedForUser).toHaveBeenCalledTimes(1);
		expect(mockGetFollowingFeedForUser).toHaveBeenCalledWith(["a", "b"]);
	});

	it("Should return a twitter feed", async () => {
		const result = await fromFollowing(mockGetFollowingListByUserId, mockGetFollowingFeedForUser, validId);
		expect(result).toHaveProperty("feed");
		expect(result.feed.length).toBeGreaterThan(0);
		expect(result).toHaveProperty("error");
		expect(result.error).toBe(false);
		expect(result).not.toHaveProperty("errorMessage");
	});

	it("Should error gracefully when an error is thrown", async () => {
		mockGetFollowingListByUserId.mockImplementationOnce(() => {
			throw new Error("error");
		});

		const result = await fromFollowing(mockGetFollowingListByUserId, mockGetFollowingFeedForUser, validId);

		expect(result).toHaveProperty("error");
		expect(result).toHaveProperty("errorMessage");
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Error getting feed from following.");
		expect(result).toHaveProperty("feed");
		expect(result.feed).toHaveLength(0);
	});
});
