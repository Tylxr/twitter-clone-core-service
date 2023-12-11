export interface IGenericCache {
	get<T>(key: string): Promise<T | null>;
	set<T>(key: string, payload: T): Promise<string | null>;
}
