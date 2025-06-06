// src/lib/api/statisty/base.ts
export interface APIError {
	message: string;
	status?: number;
	code?: string;
}

export class APICallError extends Error {
	constructor(
		message: string,
		public status?: number,
		public code?: string
	) {
		super(message);
		this.name = 'APICallError';
	}
}

export async function apiCall<T>(url: string, options: RequestInit = {}): Promise<T> {
	try {
		const response = await fetch(url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			}
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new APICallError(
				`API Error: ${response.status} - ${response.statusText}. ${errorText}`,
				response.status,
				response.status.toString()
			);
		}

		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			return response.json();
		} else {
			return response.text() as unknown as T;
		}
	} catch (error) {
		if (error instanceof APICallError) {
			throw error;
		}

		console.error('API call failed:', error);
		throw new APICallError(
			`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
			0,
			'NETWORK_ERROR'
		);
	}
}

export function validateApiKey(keyName: string, apiKey?: string): string {
	if (!apiKey) {
		throw new Error(
			`${keyName} API key is not configured. Please check your environment variables.`
		);
	}
	return apiKey;
}

// Rate limiting helper
export class RateLimiter {
	private requests: number[] = [];

	constructor(
		private maxRequests: number,
		private windowMs: number
	) {}

	async canMakeRequest(): Promise<boolean> {
		const now = Date.now();

		// Remove old requests outside the window
		this.requests = this.requests.filter((time) => now - time < this.windowMs);

		return this.requests.length < this.maxRequests;
	}

	recordRequest(): void {
		this.requests.push(Date.now());
	}

	async waitForSlot(): Promise<void> {
		while (!(await this.canMakeRequest())) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
		this.recordRequest();
	}
}

// Create rate limiters for different APIs
export const nutritionRateLimiter = new RateLimiter(100, 60 * 60 * 1000); // 100 requests per hour
export const airQualityRateLimiter = new RateLimiter(1000, 24 * 60 * 60 * 1000); // 1000 requests per day

export function createApiHeaders(apiKey: string, keyHeader: string = 'X-Api-Key'): HeadersInit {
	return {
		[keyHeader]: apiKey,
		'Content-Type': 'application/json'
	};
}
