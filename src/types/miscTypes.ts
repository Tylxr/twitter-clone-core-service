export interface IGenericCache {
	get<T>(key: string): Promise<T | null>;
	set<T, J>(key: string, payload: T, options?: J): Promise<string | null>;
	emit<T>(eventName: string, payload: T): void;
	listen(eventName: string, callback: (message: string) => void): Promise<void>;
	delete(key: string): Promise<boolean>;
}

export type SocketEmitter = (name: string, payload?: any) => void;
