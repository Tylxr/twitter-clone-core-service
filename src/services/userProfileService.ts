import { IGenericResponse } from "@/types/networkTypes";
import { IGenericUserProfileModel, IGenericUserProfileRepo, IUserProfileResponse } from "@/types/userProfileTypes";

export async function createUserProfile(username: string, userProfileModel: IGenericUserProfileModel): Promise<IGenericResponse> {
	if (!username || username.length < 4) {
		return { error: true, errorMessage: "Username failed validation." };
	}

	try {
		const existingUserProfile = await userProfileModel.getByUsername(username);
		if (existingUserProfile) {
			return { error: true, errorMessage: `Existing user profile found for username ${username}.` };
		}
		const userProfile = new userProfileModel({ username, bio: "", followers: [], following: [], createdDate: new Date() });
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

export async function retrieveUserProfile(userProfileRepo: IGenericUserProfileRepo, username: string): Promise<IUserProfileResponse> {
	if (!username || username.length < 4) {
		return { error: true, errorMessage: "Invalid username provided.", userProfile: undefined };
	}

	const userProfileResponse: IUserProfileResponse = await userProfileRepo.retrieveUserProfile(username);
	return userProfileResponse;
}

export async function updateUserProfile(userProfileModel: IGenericUserProfileModel, username: string, bio: string): Promise<IGenericResponse> {
	// - Check the bio is a string, check length < 201
	// - Using the model, update the doc, save()
	// - Emit an event to invalidate the cache

	if (typeof bio !== "string" || bio.length > 200) {
		return { error: true, errorMessage: "Invalid bio provided." };
	}

	const existingUserProfile = await userProfileModel.getByUsername(username);
	if (!existingUserProfile) {
		return { error: true, errorMessage: `No user profile found for username ${username}.` };
	}

	existingUserProfile.bio = bio;
	try {
		await existingUserProfile.save();
		// TODO: Emit cache invalidation event
	} catch (err) {
		console.error(err);
		return { error: true, errorMessage: "Error updating user profile." };
	}
}
