// src/lib/api/index.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { CarbonFootprintData, CarbonInputs } from './statisty/carbon.js';
import { calculateCarbonFootprint, validateCarbonInputs } from './statisty/carbon.js';

export interface StatistyMetric {
	id: string;
	user_id: string;
	metric: string;
	data: any;
	created_at: string;
	updated_at: string;
}

export class StatistyAPI {
	constructor(private supabase: SupabaseClient) {}

	async saveMetric(userId: string, metric: string, data: any): Promise<StatistyMetric | null> {
		try {
			const { data: result, error } = await this.supabase
				.from('statisty_metrics')
				.insert({
					user_id: userId,
					metric,
					data
				})
				.select()
				.single();

			if (error) throw error;
			return result;
		} catch (error) {
			console.error('Error saving metric:', error);
			throw error;
		}
	}

	async getMetrics(userId: string, metric: string, limit?: number): Promise<StatistyMetric[]> {
		try {
			let query = this.supabase
				.from('statisty_metrics')
				.select('*')
				.eq('user_id', userId)
				.eq('metric', metric)
				.order('created_at', { ascending: false });

			if (limit) {
				query = query.limit(limit);
			}

			const { data, error } = await query;
			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error('Error getting metrics:', error);
			throw error;
		}
	}

	async getWeeklyMetrics(userId: string, metric: string): Promise<StatistyMetric[]> {
		try {
			const weekAgo = new Date();
			weekAgo.setDate(weekAgo.getDate() - 7);

			const { data, error } = await this.supabase
				.from('statisty_metrics')
				.select('*')
				.eq('user_id', userId)
				.eq('metric', metric)
				.gte('created_at', weekAgo.toISOString())
				.order('created_at', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error('Error getting weekly metrics:', error);
			throw error;
		}
	}

	async getTodayMetric(userId: string, metric: string): Promise<StatistyMetric | null> {
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);

			const { data, error } = await this.supabase
				.from('statisty_metrics')
				.select('*')
				.eq('user_id', userId)
				.eq('metric', metric)
				.gte('created_at', today.toISOString())
				.lt('created_at', tomorrow.toISOString())
				.order('created_at', { ascending: false })
				.limit(1)
				.single();

			if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
			return data;
		} catch (error) {
			console.error('Error getting today metric:', error);
			return null;
		}
	}

	// Carbon-specific methods
	async saveCarbonData(
		userId: string,
		inputs: CarbonInputs
	): Promise<{ carbonData: CarbonFootprintData; saved: StatistyMetric | null }> {
		// Validate inputs
		const errors = validateCarbonInputs(inputs);
		if (errors.length > 0) {
			throw new Error(`Invalid inputs: ${errors.join(', ')}`);
		}

		// Calculate carbon footprint
		const carbonData = calculateCarbonFootprint(inputs);

		// Save to database
		const saved = await this.saveMetric(userId, 'carbon', {
			...carbonData,
			inputs
		});

		return { carbonData, saved };
	}

	async getCarbonData(userId: string, limit?: number): Promise<CarbonFootprintData[]> {
		const metrics = await this.getMetrics(userId, 'carbon', limit);
		return metrics.map((metric) => ({
			transport: metric.data.transport,
			energy: metric.data.energy,
			food: metric.data.food,
			total: metric.data.total,
			category: metric.data.category,
			date: new Date(metric.created_at).toLocaleDateString()
		}));
	}

	async getWeeklyCarbonData(userId: string): Promise<CarbonFootprintData[]> {
		const metrics = await this.getWeeklyMetrics(userId, 'carbon');
		return metrics.map((metric) => ({
			transport: metric.data.transport,
			energy: metric.data.energy,
			food: metric.data.food,
			total: metric.data.total,
			category: metric.data.category,
			date: new Date(metric.created_at).toLocaleDateString()
		}));
	}

	async getTodayCarbonData(userId: string): Promise<CarbonFootprintData | null> {
		const metric = await this.getTodayMetric(userId, 'carbon');
		if (!metric) return null;

		return {
			transport: metric.data.transport,
			energy: metric.data.energy,
			food: metric.data.food,
			total: metric.data.total,
			category: metric.data.category,
			date: new Date(metric.created_at).toLocaleDateString()
		};
	}
}

export function createStatistyAPI(supabase: SupabaseClient): StatistyAPI {
	return new StatistyAPI(supabase);
}

// Re-export from carbon module
export * from './statisty/carbon.js';
