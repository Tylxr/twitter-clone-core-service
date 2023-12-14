import { IGenericCache } from "@/types/cacheTypes";
import { IGenericResponse } from "@/types/networkTypes";
import { IGenericUserProfileModel, IGenericUserProfileRepo, IUserProfileObject, IUserProfileResponse } from "@/types/userProfileTypes";

export default class UserProfileRepository implements IGenericUserProfileRepo {
	private userProfileModel: IGenericUserProfileModel;
	private cache: IGenericCache;

	constructor(userProfileModel: IGenericUserProfileModel, cache: IGenericCache) {
		this.userProfileModel = userProfileModel;
		this.cache = cache;
	}

	public async retrieveUserProfile(username: string): Promise<IUserProfileResponse> {
		const cachedEntry: IUserProfileObject = await this.cache.get(`user_profile_${username}`);

		if (cachedEntry) {
			console.log(`Found ${username} in the cache. Returning cached entry.`);
			return { error: false, userProfile: cachedEntry };
		} else {
			try {
				const userProfile = await this.userProfileModel.getByUsername(username);
				if (userProfile) {
					// Set the cache
					await this.cache.set(`user_profile_${username}`, userProfile);
					console.log(`Unable to find ${username} in the cache. Updating cache. Pulled record from DB.`);
				}
				return { error: !userProfile, userProfile };
			} catch (err) {
				console.error(err);
				console.error("Error trying to retrieve user profile for username: " + username);
				return { error: true, userProfile: undefined, errorMessage: "Unable to retrieve user: " + username };
			}
		}
	}
}
