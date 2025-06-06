// src/lib/api/index.ts
import type { SupabaseClient } from '@supabase/supabase-js';

export * from './statisty/bmi.js';
export * from './statisty/sleep.js';
export * from './statisty/hydration.js';
export * from './statisty/nutrition.js';
export * from './statisty/carbon.js';
export * from './statisty/air.js';

// Base API client for Statisty metrics
export class StatistyAPI {
	constructor(private supabase: SupabaseClient) {}

	async saveMetric(userId: string, metric: string, data: any) {
		try {
			const { data: result, error } = await this.supabase.from('statisty_metrics').insert({
				user_id: userId,
				metric,
				data,
				created_at: new Date().toISOString()
			});

			if (error) {
				console.error('Error saving metric:', error);
				throw error;
			}

			return result;
		} catch (error) {
			console.error('Failed to save metric:', error);
			throw error;
		}
	}

	async getMetrics(userId: string, metric?: string, limit: number = 50) {
		try {
			let query = this.supabase
				.from('statisty_metrics')
				.select('*')
				.eq('user_id', userId)
				.order('created_at', { ascending: false })
				.limit(limit);

			if (metric) {
				query = query.eq('metric', metric);
			}

			const { data, error } = await query;

			if (error) {
				console.error('Error fetching metrics:', error);
				throw error;
			}

			return data || [];
		} catch (error) {
			console.error('Failed to fetch metrics:', error);
			throw error;
		}
	}

	async getLatestMetric(userId: string, metric: string) {
		try {
			const { data, error } = await this.supabase
				.from('statisty_metrics')
				.select('*')
				.eq('user_id', userId)
				.eq('metric', metric)
				.order('created_at', { ascending: false })
				.limit(1)
				.single();

			if (error && error.code !== 'PGRST116') {
				// PGRST116 is "not found"
				console.error('Error fetching latest metric:', error);
				throw error;
			}

			return data;
		} catch (error) {
			console.error('Failed to fetch latest metric:', error);
			throw error;
		}
	}

	async deleteMetric(userId: string, metricId: string) {
		try {
			const { error } = await this.supabase
				.from('statisty_metrics')
				.delete()
				.eq('user_id', userId)
				.eq('id', metricId);

			if (error) {
				console.error('Error deleting metric:', error);
				throw error;
			}

			return true;
		} catch (error) {
			console.error('Failed to delete metric:', error);
			throw error;
		}
	}

	async updateMetric(userId: string, metricId: string, data: any) {
		try {
			const { data: result, error } = await this.supabase
				.from('statisty_metrics')
				.update({
					data,
					updated_at: new Date().toISOString()
				})
				.eq('user_id', userId)
				.eq('id', metricId);

			if (error) {
				console.error('Error updating metric:', error);
				throw error;
			}

			return result;
		} catch (error) {
			console.error('Failed to update metric:', error);
			throw error;
		}
	}

	// Utility method to get metrics for a specific date range
	async getMetricsByDateRange(userId: string, metric: string, startDate: string, endDate: string) {
		try {
			const { data, error } = await this.supabase
				.from('statisty_metrics')
				.select('*')
				.eq('user_id', userId)
				.eq('metric', metric)
				.gte('created_at', startDate)
				.lte('created_at', endDate)
				.order('created_at', { ascending: true });

			if (error) {
				console.error('Error fetching metrics by date range:', error);
				throw error;
			}

			return data || [];
		} catch (error) {
			console.error('Failed to fetch metrics by date range:', error);
			throw error;
		}
	}
}

// Helper function to create StatistyAPI instance
export function createStatistyAPI(supabase: SupabaseClient): StatistyAPI {
	return new StatistyAPI(supabase);
}
