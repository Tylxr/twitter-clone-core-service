import { IGenericCache } from "@/types/cacheTypes";
import { IGenericUserProfileModel, IGenericUserProfileRepo, IUserProfileObject } from "@/types/userProfileTypes";

/**
 * TODO:
 *  NEED TO RE-WRITE THIS FILE WITH THE TWEET REPO IMPLEMENTATION.
 */

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
				if (userProfile) {
					// Set the cache - 1 hour
					await this.cache.set(`user_profile_${username}`, userProfile, { EX: 60 * 20 });
					console.log(`Unable to find ${username} in the cache. Updating cache. Pulled record from DB.`);
				}
				return userProfile;
			} catch (err) {
				console.error(err);
				throw new Error("Unable to retrieve user with username: " + username);
			}
		}
	}

	public async updateUserProfile(username: string, bio: string): Promise<void> {
		try {
			const existingUserProfile = await this.userProfileModel.getByUsername(username);
			if (!existingUserProfile) throw new Error("No user profile found for user with username: " + username);
			existingUserProfile.bio = bio;
			await existingUserProfile.save();
			await this.cache.delete(`user_profile_${username}`);
		} catch (err) {
			console.error(err);
			throw new Error("Error updating user with username: " + username);
		}
	}
}
