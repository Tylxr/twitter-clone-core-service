import { IGenericResponse, IUserProfileIdResponse, IUserProfileResponse } from "@/types/networkTypes";
import { IGenericUserProfileModel, IGenericUserProfileRepo } from "@/types/userProfileTypes";

export async function createUserProfile(username: string, userProfileModel: IGenericUserProfileModel): Promise<IGenericResponse> {
	if (!username || username.length < 4) {
		return { error: true, errorMessage: "Username failed validation." };
	}

	username = username.toLowerCase();

	try {
		const existingUserProfile = await userProfileModel.getByUsername(username);
		if (existingUserProfile) {
			return { error: true, errorMessage: `Existing user profile found for username ${username}.` };
		}
		const userProfile = new userProfileModel({ username, name: username, bio: "", followers: [], following: [], createdDate: new Date() });
		await userProfile.save();
		return { error: false, message: "Resource created successfully." };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error creating user profile." };
	}
}

export async function deleteUserProfile(username: string, userProfileModel: IGenericUserProfileModel): Promise<IGenericResponse> {
	if (!username || username.length < 4) {
		return { error: true, errorMessage: "Invalid username provided." };
	}

	const existingUserProfile = await userProfileModel.getByUsername(username);
	if (!existingUserProfile) {
		return { error: true, errorMessage: `No user profile found for username ${username}.` };
	}

	try {
		await userProfileModel.deleteByUsername(username);
		return { error: false, message: "Resource deleted successfully." };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error deleting user profile." };
	}
}

export async function retrieveUserIdByUsername(userProfileModel: IGenericUserProfileModel, username: string): Promise<IUserProfileIdResponse> {
	if (!username || username.length < 4) {
		return { error: true, errorMessage: "Invalid username provided.", userId: undefined };
	}

	try {
		const userId = await userProfileModel.getIdByUsername(username);
		return { error: false, userId };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error deleting user profile.", userId: undefined };
	}
}

export async function retrieveUserProfile(userProfileRepo: IGenericUserProfileRepo, username: string): Promise<IUserProfileResponse> {
	if (!username || username.length < 4) {
		return { error: true, errorMessage: "Invalid username provided.", userProfile: null };
	}

	try {
		const userProfile = await userProfileRepo.retrieveUserProfile(username);
		return { error: !userProfile, userProfile: userProfile, errorMessage: !userProfile ? "No user profile found for username: " + username : "" };
	} catch (err) {
		return { error: true, errorMessage: err.message, userProfile: null };
	}
}

export async function updateUserProfile(
	userProfileRepo: IGenericUserProfileRepo,
	username: string,
	data: { bio: string; name: string },
): Promise<IGenericResponse> {
	if (typeof data.bio !== "string" || data.bio.length > 200) {
		return { error: true, errorMessage: "Invalid bio provided." };
	}
	if (typeof data.name !== "string" || data.name.length < 4 || data.name.length > 25) {
		return { error: true, errorMessage: "Invalid name provided." };
	}

	try {
		await userProfileRepo.updateUserProfile(username, data);
		return { error: false };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error updating user profile." };
	}
}

export async function toggleFollowUser(userProfileModel: IGenericUserProfileModel, username: string, userProfileUsername: string): Promise<IGenericResponse> {
	if (!username) {
		return { error: true, errorMessage: "No/invalid username provided." };
	}
	if (!userProfileUsername) {
		return { error: true, errorMessage: "Unable to determine originating user profile." };
	}
	if (username.toLowerCase() === userProfileUsername.toLowerCase()) {
		return { error: true, errorMessage: "Following your own account is not permitted." };
	}

	try {
		await userProfileModel.toggleFollow(username, userProfileUsername);
		return { error: false };
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: `Error trying to follower user ${username}.` };
	}
}
