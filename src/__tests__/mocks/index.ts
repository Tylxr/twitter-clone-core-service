import { IGenericTweetRepo } from "@/types/tweetTypes";
import { IGenericUserProfileRepo } from "@/types/userProfileTypes";

export const mockTweetRepo = {
	createTweet: jest.fn(),
	getFeedFromAll: jest.fn().mockImplementation(() => [{}, {}]),
	checkFeedFromAll: jest.fn().mockImplementation(() => true),
	getFeedFromUser: jest.fn().mockImplementation(() => [{}, {}]),
	toggleLike: jest.fn(),
	postComment: jest.fn(),
	toggleLikeTweetComment: jest.fn(),
} as jest.Mocked<IGenericTweetRepo>;

export const mockUserProfileRepo = {
	retrieveUserProfile: jest.fn(),
	updateUserProfile: jest.fn(),
	toggleFollowUser: jest.fn(),
} as jest.Mocked<IGenericUserProfileRepo>;

export const mockUserProfile = {
	_id: "123",
	username: "test_user",
	name: "Test User",
	bio: "This is my bio",
	followers: ["a", "b", "c"],
	following: ["a", "b", "c"],
	followersFormatted: "5",
	followingFormatted: "5",
	createdDate: new Date(),
};
