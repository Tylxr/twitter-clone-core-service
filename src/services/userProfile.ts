import { IAPIResponse } from "@/types/network";
import { IGenericUserProfileModel } from "@/types/userProfile";

export async function createUserProfile(username: string, userProfileModel: IGenericUserProfileModel): Promise<IAPIResponse> {
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

export async function deleteUserProfile(username: string, userProfileModel: IGenericUserProfileModel): Promise<IAPIResponse> {
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
