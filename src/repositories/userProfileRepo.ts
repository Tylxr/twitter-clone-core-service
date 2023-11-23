import { IGenericCache } from "@/types/cacheTypes";
import { IGenericUserProfileModel } from "@/types/userProfileTypes";

export default class UserProfileRepository {
	private userProfileModel: IGenericUserProfileModel;
	private cache: IGenericCache;

	constructor(userProfileModel: IGenericUserProfileModel, cache: IGenericCache) {
		this.userProfileModel = userProfileModel;
		this.cache = cache;
	}
}
