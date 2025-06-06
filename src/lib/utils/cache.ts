// src/lib/utils/cache.ts
export class APICache {
	private cache = new Map();

	async get(key: string, fetcher: () => Promise<any>, ttl = 3600000) {
		const cached = this.cache.get(key);
		if (cached && Date.now() - cached.timestamp < ttl) {
			return cached.data;
		}

		const data = await fetcher();
		this.cache.set(key, { data, timestamp: Date.now() });
		return data;
	}
}
