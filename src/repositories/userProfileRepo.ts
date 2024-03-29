import { IGenericCache } from "@/types/miscTypes";
import { IGenericUserProfileModel, IGenericUserProfileRepo, IUserProfileObject } from "@/types/userProfileTypes";

export default class UserProfileRepository implements IGenericUserProfileRepo {
	private userProfileModel: IGenericUserProfileModel;
	private cache: IGenericCache;

	constructor(userProfileModel: IGenericUserProfileModel, cache: IGenericCache) {
		this.userProfileModel = userProfileModel;
		this.cache = cache;
	}

	public async retrieveUserProfile(username: string): Promise<IUserProfileObject | null> {
		const cachedEntry: IUserProfileObject = await this.cache.get(`user_profile_${username}`);

		if (cachedEntry) {
			console.log(`Found ${username} in the cache. Returning cached entry.`);
			return cachedEntry;
		} else {
			try {
				const userProfile = await this.userProfileModel.getByUsername(username);
				const userProfileObj: IUserProfileObject = userProfile.toObject();

				// Set the cache - 20 minutes
				await this.cache.set(`user_profile_${username}`, userProfileObj, { EX: 60 * 20 });
				console.log(`Unable to find ${username} in the cache. Updating cache. Pulled record from DB.`);

				return userProfileObj;
			} catch (err) {
				console.error(err);
				throw new Error("Unable to retrieve user with username: " + username);
			}
		}
	}

	public async updateUserProfile(username: string, data: { bio: string; name: string }): Promise<void> {
		try {
			const existingUserProfile = await this.userProfileModel.getByUsername(username);
			if (!existingUserProfile) throw new Error("No user profile found for user with username: " + username);

			// Update userprofile
			existingUserProfile.bio = data.bio;
			existingUserProfile.name = data.name;
			await existingUserProfile.save();

			// Invalidate cache
			await this.cache.delete(`user_profile_${username}`);
		} catch (err) {
			console.error(err);
			throw new Error("Error updating user with username: " + username);
		}
	}

	public async toggleFollowUser(username: string, userProfileUsername: string): Promise<void> {
		try {
			// Toggle follow
			await this.userProfileModel.toggleFollow(username, userProfileUsername);
		} catch (err) {
			console.error(err);
			throw new Error(`Unable to toggle follow of ${username} for ${userProfileUsername}.`);
		}

		try {
			// Invalidate cache
			await this.cache.delete(`user_profile_${username}`);
			await this.cache.delete(`user_profile_${userProfileUsername}`);
		} catch (err) {
			console.error(err);
			throw new Error(`Unable to invalidate cache for "user_profile_${username}" or "user_profile_${userProfileUsername}".`);
		}
	}
}
