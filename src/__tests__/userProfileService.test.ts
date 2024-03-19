import { IGenericResponse, IUserProfileIdResponse, IUserProfileResponse } from "@/types/networkTypes";
import {
	createUserProfile,
	deleteUserProfile,
	retrieveUserIdByUsername,
	retrieveUserProfile,
	updateUserProfile,
	toggleFollowUser,
} from "../services/userProfileService";
import { IGenericUserProfileModel, IUserProfileDocument, IUserProfileObject } from "@/types/userProfileTypes";
import userProfileModel from "../models/userProfileModel";
import { mockUserProfile, mockUserProfileRepo } from "./mocks";

// Mocked dependencies
const mockUserProfileDocument = { save: jest.fn() };
const mockUsername = "testuser";
jest.mock("../models/userProfileModel", () => {
	return jest.fn().mockImplementation(() => mockUserProfileDocument);
});

beforeEach(() => {
	// Ignore errors thrown purposely from inside functions that are being tested
	jest.spyOn(console, "error").mockImplementation(jest.fn());
	userProfileModel.getByUsername = jest.fn().mockImplementation(() => false);
	userProfileModel.deleteByUsername = jest.fn();
	userProfileModel.getIdByUsername = jest.fn();
});

describe("Create User Profile - UserProfileService", () => {
	it("Should return an error if username is invalid", async () => {
		const invalidUsernames = ["", "abc"];
		for (const invalidUsername of invalidUsernames) {
			const result: IGenericResponse = await createUserProfile(invalidUsername, userProfileModel);
			expect(result.error).toBe(true);
			expect(result.errorMessage).toBe("Username failed validation.");
			expect(userProfileModel.getByUsername).not.toHaveBeenCalled();
			expect(mockUserProfileDocument.save).not.toHaveBeenCalled();
		}
	});

	it("Should return an error if user profile already exists", async () => {
		userProfileModel.getByUsername = jest.fn().mockImplementationOnce(() => true);
		const result: IGenericResponse = await createUserProfile(mockUsername, userProfileModel);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe(`Existing user profile found for username ${mockUsername}.`);
		expect(userProfileModel.getByUsername).toHaveBeenCalledWith(mockUsername.toLowerCase());
		expect(mockUserProfileDocument.save).not.toHaveBeenCalled();
	});

	it("Should create user profile successfully", async () => {
		const result: IGenericResponse = await createUserProfile(mockUsername, userProfileModel);
		expect(result.error).toBe(false);
		expect(result.message).toBe("Resource created successfully.");
		expect(userProfileModel.getByUsername).toHaveBeenCalledWith(mockUsername.toLowerCase());
		expect(mockUserProfileDocument.save).toHaveBeenCalled();
	});

	it("Should return an error if an error occurs during user profile creation", async () => {
		userProfileModel.getByUsername = jest.fn().mockRejectedValueOnce(new Error("error"));
		const result: IGenericResponse = await createUserProfile(mockUsername, userProfileModel);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Error creating user profile.");
		expect(userProfileModel.getByUsername).toHaveBeenCalledWith(mockUsername.toLowerCase());
		expect(mockUserProfileDocument.save).not.toHaveBeenCalled();
	});
});

describe("Delete User Profile - UserProfileService", () => {
	it("Should return error if username is invalid", async () => {
		const invalidUsernames = ["", "abc"];
		for (const invalidUsername of invalidUsernames) {
			const result: IGenericResponse = await deleteUserProfile(invalidUsername, userProfileModel);
			expect(result.error).toBe(true);
			expect(result.errorMessage).toBe("Invalid username provided.");
			expect(userProfileModel.getByUsername).not.toHaveBeenCalled();
			expect(userProfileModel.deleteByUsername).not.toHaveBeenCalled();
		}
	});

	it("Should return error if user profile does not exist", async () => {
		userProfileModel.getByUsername = jest.fn().mockResolvedValueOnce(false);
		const result: IGenericResponse = await deleteUserProfile(mockUsername, userProfileModel);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe(`No user profile found for username ${mockUsername}.`);
		expect(userProfileModel.getByUsername).toHaveBeenCalledWith(mockUsername);
		expect(userProfileModel.deleteByUsername).not.toHaveBeenCalled();
	});

	it("Should delete user profile successfully", async () => {
		const mockProfileData: IUserProfileObject = { username: mockUsername, bio: "", name: "", followers: [], following: [], createdDate: new Date() };
		userProfileModel.getByUsername = jest.fn().mockResolvedValueOnce(mockProfileData);
		const result: IGenericResponse = await deleteUserProfile(mockUsername, userProfileModel);
		expect(result.error).toBe(false);
		expect(result.message).toBe("Resource deleted successfully.");
		expect(userProfileModel.getByUsername).toHaveBeenCalledWith(mockUsername);
		expect(userProfileModel.deleteByUsername).toHaveBeenCalledWith(mockUsername);
	});

	it("Should return error if an error occurs during user profile deletion", async () => {
		userProfileModel.getByUsername = jest.fn().mockResolvedValueOnce({});
		userProfileModel.deleteByUsername = jest.fn().mockRejectedValueOnce(new Error("error"));
		const result: IGenericResponse = await deleteUserProfile(mockUsername, userProfileModel);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Error deleting user profile.");
		expect(userProfileModel.getByUsername).toHaveBeenCalledWith(mockUsername);
		expect(userProfileModel.deleteByUsername).toHaveBeenCalledWith(mockUsername);
	});
});

describe("Retrieve User Id By Username - UserProfileService", () => {
	it("Should return error if username is invalid", async () => {
		const invalidUsernames = ["", "abc"];
		for (const invalidUsername of invalidUsernames) {
			const result: IUserProfileIdResponse = await retrieveUserIdByUsername(userProfileModel, invalidUsername);
			expect(result.error).toBe(true);
			expect(result.errorMessage).toBe("Invalid username provided.");
			expect(result.userId).toBeUndefined();
			expect(userProfileModel.getIdByUsername).not.toHaveBeenCalled();
		}
	});

	it("Should return user ID successfully", async () => {
		const mockUsername = "testuser";
		const mockUserId = "mockUserId";
		userProfileModel.getIdByUsername = jest.fn().mockResolvedValueOnce(mockUserId);
		const result: IUserProfileIdResponse = await retrieveUserIdByUsername(userProfileModel, mockUsername);
		expect(result.error).toBe(false);
		expect(result).not.toHaveProperty("errorMessage");
		expect(result.userId).toBe(mockUserId);
		expect(userProfileModel.getIdByUsername).toHaveBeenCalledWith(mockUsername);
	});

	it("Should return error if an error occurs during user ID retrieval", async () => {
		const mockUsername = "testuser";
		const mockError = new Error("Database Error");
		userProfileModel.getIdByUsername = jest.fn().mockRejectedValueOnce(mockError);
		const result: IUserProfileIdResponse = await retrieveUserIdByUsername(userProfileModel, mockUsername);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Error retrieving user profile Id.");
		expect(result.userId).toBeUndefined();
		expect(userProfileModel.getIdByUsername).toHaveBeenCalledWith(mockUsername);
	});
});

describe("Retrieve User Profile - UserProfileService", () => {
	it("Should return error if username is invalid", async () => {
		const invalidUsernames = ["", "abc"];
		for (const invalidUsername of invalidUsernames) {
			const result: IUserProfileResponse = await retrieveUserProfile(mockUserProfileRepo, invalidUsername);
			expect(result.error).toBe(true);
			expect(result.errorMessage).toBe("Invalid username provided.");
			expect(result.userProfile).toBeNull();
			expect(mockUserProfileRepo.retrieveUserProfile).not.toHaveBeenCalled();
		}
	});

	it("Should return user profile successfully", async () => {
		mockUserProfileRepo.retrieveUserProfile.mockResolvedValueOnce(mockUserProfile);
		const result: IUserProfileResponse = await retrieveUserProfile(mockUserProfileRepo, mockUsername);
		expect(result.error).toBe(mockUserProfile ? false : true);
		expect(result.errorMessage).toBe(mockUserProfile ? "" : `No user profile found for username: ${mockUsername}`);
		expect(result.userProfile).toBe(mockUserProfile);
		expect(mockUserProfileRepo.retrieveUserProfile).toHaveBeenCalledWith(mockUsername);
	});

	it("Should return error if an error occurs during user profile retrieval", async () => {
		const mockError = new Error("Database Error");
		mockUserProfileRepo.retrieveUserProfile.mockRejectedValueOnce(mockError);
		const result: IUserProfileResponse = await retrieveUserProfile(mockUserProfileRepo, mockUsername);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe(mockError.message);
		expect(result.userProfile).toBeNull();
		expect(mockUserProfileRepo.retrieveUserProfile).toHaveBeenCalledWith(mockUsername);
	});
});

describe("Toggle Follow User - UserProfileService", () => {
	it("Should return error if username is not provided", async () => {
		const result: IGenericResponse = await toggleFollowUser(mockUserProfileRepo, "", "userProfileUsername");
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("No/invalid username provided.");
		expect(mockUserProfileRepo.toggleFollowUser).not.toHaveBeenCalled();
	});

	it("Should return error if userProfileUsername is not provided", async () => {
		const result: IGenericResponse = await toggleFollowUser(mockUserProfileRepo, "username", "");
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Unable to determine originating user profile.");
		expect(mockUserProfileRepo.toggleFollowUser).not.toHaveBeenCalled();
	});

	it("Should return error if username and userProfileUsername are the same", async () => {
		const result: IGenericResponse = await toggleFollowUser(mockUserProfileRepo, mockUsername, mockUsername);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe("Following your own account is not permitted.");
		expect(mockUserProfileRepo.toggleFollowUser).not.toHaveBeenCalled();
	});

	it("Should toggle follow successfully", async () => {
		const userProfileUsername = "userProfileUsername";
		mockUserProfileRepo.toggleFollowUser.mockResolvedValueOnce(undefined);
		const result: IGenericResponse = await toggleFollowUser(mockUserProfileRepo, mockUsername, userProfileUsername);
		expect(result.error).toBe(false);
		expect(result.errorMessage).toBeUndefined();
		expect(mockUserProfileRepo.toggleFollowUser).toHaveBeenCalledWith(mockUsername, userProfileUsername);
	});

	it("Should return error if an error occurs during toggle follow", async () => {
		const userProfileUsername = "userProfileUsername";
		const mockError = new Error("Database Error");
		mockUserProfileRepo.toggleFollowUser.mockRejectedValueOnce(mockError);
		const result: IGenericResponse = await toggleFollowUser(mockUserProfileRepo, mockUsername, userProfileUsername);
		expect(result.error).toBe(true);
		expect(result.errorMessage).toBe(`Error trying to follower user ${mockUsername}.`);
		expect(mockUserProfileRepo.toggleFollowUser).toHaveBeenCalledWith(mockUsername, userProfileUsername);
	});
});
