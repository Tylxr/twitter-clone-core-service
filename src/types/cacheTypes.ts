export interface IGenericCache {
	get<T>(key: string): Promise<T | null>;
	set<T, J>(key: string, payload: T, options?: J): Promise<string | null>;
}
