import { ITweetObject } from "@/types/tweetTypes";
import { createTweet, createComment, toggleLikeTweet, toggleLikeTweetComment, getTweetById } from "../services/tweetsService";
import { IGenericResponse, ITweetResponse } from "@/types/networkTypes";
import { mockTweetRepo, mockUserProfile } from "./mocks";

// Mocked dependencies
const mockUserProfileUsername = "user123";
const mockUserProfileId = "user123";
const mockCommentId = "comment456";
const mockTweetId = "tweet123";
const mockTweetUserId = "user456";
const mockGetById = jest.fn();
const mockTweet: ITweetObject = {
	userProfile: mockUserProfileId,
	body: "Tweet body",
	comments: [],
	likes: ["a", "b", "c"],
	createdDate: new Date(),
};

beforeEach(() => {
	// Ignore errors thrown purposely from inside functions that are being tested
	jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Create Tweet - TweetService", () => {
	it("Should return an error if tweet body is invalid", async () => {
		const invalidTweet = ""; // Empty string
		const result: IGenericResponse = await createTweet(mockTweetRepo, mockUserProfile, invalidTweet);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Tweet body provided is invalid.");
		expect(mockTweetRepo.createTweet).not.toHaveBeenCalled();
	});

	it("Should return an error if tweet body is too long", async () => {
		const invalidTweet =
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."; // Empty string
		const result: IGenericResponse = await createTweet(mockTweetRepo, mockUserProfile, invalidTweet);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Tweet body provided is invalid.");
		expect(mockTweetRepo.createTweet).not.toHaveBeenCalled();
	});

	it("Should return an error if UserProfile is invalid", async () => {
		const invalidUserProfile = {} as any; // Missing properties
		const result: IGenericResponse = await createTweet(mockTweetRepo, invalidUserProfile, "Hello World");
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("UserProfile provided is invalid.");
		expect(mockTweetRepo.createTweet).not.toHaveBeenCalled();
	});

	it("Should return an error if an error occurs while posting a tweet", async () => {
		mockTweetRepo.createTweet.mockRejectedValueOnce(new Error("error"));
		const result: IGenericResponse = await createTweet(mockTweetRepo, mockUserProfile, "Hello World");
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Error posting a tweet.");
		expect(mockTweetRepo.createTweet).toHaveBeenCalledTimes(1);
	});

	it("Should successfully post a tweet", async () => {
		const successMessage = "Tweet posted successfully.";
		mockTweetRepo.createTweet.mockResolvedValueOnce();
		const result: IGenericResponse = await createTweet(mockTweetRepo, mockUserProfile, "Hello World");
		expect(result.error).toBe(false);
		expect(result.message).toBe(successMessage);
		expect(mockTweetRepo.createTweet).toHaveBeenCalledTimes(1);
		expect(mockTweetRepo.createTweet).toHaveBeenCalledWith(mockUserProfile, "Hello World");
	});
});

describe("Create Comment - TweetService", () => {
	it("Should return an error if comment is invalid", async () => {
		const invalidComment = ""; // Empty string
		const result: IGenericResponse = await createComment(mockTweetRepo, mockTweetId, mockUserProfileId, invalidComment, mockTweetUserId);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Comment provided is invalid.");
		expect(mockTweetRepo.postComment).not.toHaveBeenCalled();
	});

	it("Should return an error if an error occurs while posting a comment", async () => {
		const errorMessage = "Error posting a comment.";
		mockTweetRepo.postComment.mockRejectedValueOnce(new Error(errorMessage));
		const result: IGenericResponse = await createComment(mockTweetRepo, mockTweetId, mockUserProfileId, "Nice tweet!", mockTweetUserId);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe(errorMessage);
		expect(mockTweetRepo.postComment).toHaveBeenCalledTimes(1);
		expect(mockTweetRepo.postComment).toHaveBeenCalledWith(mockTweetId, mockUserProfileId, "Nice tweet!", mockTweetUserId);
	});

	it("Should successfully post a comment", async () => {
		const successMessage = "Comment posted successfully.";
		mockTweetRepo.postComment.mockResolvedValueOnce();
		const result: IGenericResponse = await createComment(mockTweetRepo, mockTweetId, mockUserProfileId, "Nice tweet!", mockTweetUserId);
		expect(result.error).toBe(false);
		expect(result.message).toBe(successMessage);
		expect(mockTweetRepo.postComment).toHaveBeenCalledTimes(1);
		expect(mockTweetRepo.postComment).toHaveBeenCalledWith(mockTweetId, mockUserProfileId, "Nice tweet!", mockTweetUserId);
	});
});

describe("Toggle Like Tweet - TweetService", () => {
	it("Should return an error if tweetId or user profile username is not provided", async () => {
		const result: IGenericResponse = await toggleLikeTweet(mockTweetRepo, "", mockUserProfileUsername, mockTweetUserId);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("No tweetId or user profile username provided.");
		expect(mockTweetRepo.toggleLike).not.toHaveBeenCalled();

		const result2: IGenericResponse = await toggleLikeTweet(mockTweetRepo, mockTweetId, "", mockTweetUserId);
		expect(result2.error).toBe(true);
		expect(result2.errorMessage).toBe("No tweetId or user profile username provided.");
		expect(mockTweetRepo.toggleLike).not.toHaveBeenCalled();
	});

	it("Should return an error if an error occurs while toggling like", async () => {
		const errorMessage = "Error trying to like tweet.";
		mockTweetRepo.toggleLike.mockRejectedValueOnce(new Error(errorMessage));
		const result: IGenericResponse = await toggleLikeTweet(mockTweetRepo, mockTweetId, mockUserProfileUsername, mockTweetUserId);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe(errorMessage);
		expect(mockTweetRepo.toggleLike).toHaveBeenCalledTimes(1);
		expect(mockTweetRepo.toggleLike).toHaveBeenCalledWith(mockTweetId, mockUserProfileUsername, mockTweetUserId);
	});

	it("Should successfully toggle like", async () => {
		mockTweetRepo.toggleLike.mockResolvedValueOnce();
		const result: IGenericResponse = await toggleLikeTweet(mockTweetRepo, mockTweetId, mockUserProfileUsername, mockTweetUserId);
		expect(result.error).toBe(false);
		expect(mockTweetRepo.toggleLike).toHaveBeenCalledTimes(1);
		expect(mockTweetRepo.toggleLike).toHaveBeenCalledWith(mockTweetId, mockUserProfileUsername, mockTweetUserId);
	});
});

describe("Toggle Like Tweet Comment - TweetService", () => {
	it("Should return an error if tweetId, commentId, or userProfile username is not provided", async () => {
		const result: IGenericResponse = await toggleLikeTweetComment(mockTweetRepo, "", mockCommentId, mockUserProfileUsername, mockTweetUserId);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("No tweetId, commentId or user profile username provided.");
		expect(mockTweetRepo.toggleLikeTweetComment).not.toHaveBeenCalled();

		const result2: IGenericResponse = await toggleLikeTweetComment(mockTweetRepo, mockTweetId, "", mockUserProfileUsername, mockTweetUserId);
		expect(result2.error).toBe(true);
		expect(result2.errorMessage).toBe("No tweetId, commentId or user profile username provided.");
		expect(mockTweetRepo.toggleLikeTweetComment).not.toHaveBeenCalled();

		const result3: IGenericResponse = await toggleLikeTweetComment(mockTweetRepo, mockTweetId, mockCommentId, "", mockTweetUserId);
		expect(result3.error).toBe(true);
		expect(result3.errorMessage).toBe("No tweetId, commentId or user profile username provided.");
		expect(mockTweetRepo.toggleLikeTweetComment).not.toHaveBeenCalled();
	});

	it("Should return an error if an error occurs while toggling like", async () => {
		const errorMessage = "Error trying to like tweet.";
		mockTweetRepo.toggleLikeTweetComment.mockRejectedValueOnce(new Error(errorMessage));
		const result: IGenericResponse = await toggleLikeTweetComment(mockTweetRepo, mockTweetId, mockCommentId, mockUserProfileUsername, mockTweetUserId);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe(errorMessage);
		expect(mockTweetRepo.toggleLikeTweetComment).toHaveBeenCalledTimes(1);
		expect(mockTweetRepo.toggleLikeTweetComment).toHaveBeenCalledWith(mockTweetId, mockCommentId, mockUserProfileUsername, mockTweetUserId);
	});

	it("Should successfully toggle like on a comment", async () => {
		mockTweetRepo.toggleLikeTweetComment.mockResolvedValueOnce();
		const result: IGenericResponse = await toggleLikeTweetComment(mockTweetRepo, mockTweetId, mockCommentId, mockUserProfileUsername, mockTweetUserId);
		expect(result.error).toBe(false);
		expect(mockTweetRepo.toggleLikeTweetComment).toHaveBeenCalledTimes(1);
		expect(mockTweetRepo.toggleLikeTweetComment).toHaveBeenCalledWith(mockTweetId, mockCommentId, mockUserProfileUsername, mockTweetUserId);
	});
});

describe("Get Tweet By Id - TweetService", () => {
	it("Should return an error if tweetId is not provided", async () => {
		const result: ITweetResponse = await getTweetById(mockGetById, "");
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("No tweetId provided.");
		expect(result.tweet).toBeUndefined();
		expect(mockGetById).not.toHaveBeenCalled();
	});

	it("Should return an error if an error occurs while retrieving tweet", async () => {
		const errorMessage = "Error trying to retrieve tweet.";
		mockGetById.mockRejectedValueOnce(new Error(errorMessage));
		const result: ITweetResponse = await getTweetById(mockGetById, mockTweetId);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe(errorMessage);
		expect(result.tweet).toBeUndefined();
		expect(mockGetById).toHaveBeenCalledTimes(1);
		expect(mockGetById).toHaveBeenCalledWith(mockTweetId);
	});

	it("Should return an error if no tweet is found for the given tweetId", async () => {
		mockGetById.mockResolvedValueOnce(undefined);
		const result: ITweetResponse = await getTweetById(mockGetById, mockTweetId);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe(`No tweet found for tweetId: ${mockTweetId}`);
		expect(result.tweet).toBeUndefined();
		expect(mockGetById).toHaveBeenCalledTimes(1);
		expect(mockGetById).toHaveBeenCalledWith(mockTweetId);
	});

	it("Should successfully retrieve tweet by tweetId", async () => {
		mockGetById.mockResolvedValueOnce(mockTweet);
		const result: ITweetResponse = await getTweetById(mockGetById, mockTweetId);
		expect(result.error).toBe(false);
		expect(result.errorMessage).toBe("");
		expect(result.tweet).toEqual(mockTweet);
		expect(mockGetById).toHaveBeenCalledTimes(1);
		expect(mockGetById).toHaveBeenCalledWith(mockTweetId);
	});
});
