// src/lib/api/statisty/nutrition.ts
export interface NutritionData {
	name: string;
	calories: number;
	serving_size_g: number;
	fat_total_g: number;
	fat_saturated_g: number;
	protein_g: number;
	sodium_mg: number;
	potassium_mg: number;
	cholesterol_mg: number;
	carbohydrates_total_g: number;
	fiber_g: number;
	sugar_g: number;
}

export interface NutritionResponse {
	items: NutritionData[];
}

export async function getNutritionData(foodQuery: string): Promise<NutritionResponse> {
	const apiKey = process.env.CALORIE_NINJAS_API_KEY;

	if (!apiKey) {
		throw new Error('CalorieNinjas API key is not configured');
	}

	try {
		const response = await fetch(
			`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(foodQuery)}`,
			{
				headers: {
					'X-Api-Key': apiKey
				} as HeadersInit
			}
		);

		if (!response.ok) {
			throw new Error(`API Error: ${response.status} - ${response.statusText}`);
		}

		const data: NutritionResponse = await response.json();
		return data;
	} catch (error) {
		console.error('Nutrition API call failed:', error);
		throw error;
	}
}

export function calculateDailyNutritionSummary(nutritionEntries: NutritionData[]): {
	totalCalories: number;
	totalProtein: number;
	totalCarbs: number;
	totalFat: number;
	totalFiber: number;
	totalSugar: number;
} {
	return nutritionEntries.reduce(
		(summary, entry) => ({
			totalCalories: summary.totalCalories + entry.calories,
			totalProtein: summary.totalProtein + entry.protein_g,
			totalCarbs: summary.totalCarbs + entry.carbohydrates_total_g,
			totalFat: summary.totalFat + entry.fat_total_g,
			totalFiber: summary.totalFiber + entry.fiber_g,
			totalSugar: summary.totalSugar + entry.sugar_g
		}),
		{
			totalCalories: 0,
			totalProtein: 0,
			totalCarbs: 0,
			totalFat: 0,
			totalFiber: 0,
			totalSugar: 0
		}
	);
}

export function getNutritionRecommendations(
	summary: ReturnType<typeof calculateDailyNutritionSummary>
) {
	const recommendations: string[] = [];

	// Basic daily recommendations (adjust based on user profile)
	const targets = {
		calories: 2000,
		protein: 150,
		carbs: 250,
		fat: 65,
		fiber: 25
	};

	if (summary.totalProtein < targets.protein * 0.8) {
		recommendations.push(
			'Consider adding more protein-rich foods like lean meats, beans, or nuts.'
		);
	}

	if (summary.totalFiber < targets.fiber * 0.6) {
		recommendations.push('Increase fiber intake with fruits, vegetables, and whole grains.');
	}

	if (summary.totalSugar > 50) {
		recommendations.push('Consider reducing sugar intake for better overall health.');
	}

	return recommendations;
}

// Alternative free API option using API Ninjas
export async function getNutritionDataFromApiNinjas(foodQuery: string): Promise<NutritionData[]> {
	const apiKey = process.env.API_NINJAS_KEY;

	if (!apiKey) {
		throw new Error('API Ninjas key is not configured');
	}

	try {
		const response = await fetch(
			`https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(foodQuery)}`,
			{
				headers: {
					'X-Api-Key': apiKey
				} as HeadersInit
			}
		);

		if (!response.ok) {
			throw new Error(`API Error: ${response.status} - ${response.statusText}`);
		}

		const data: NutritionData[] = await response.json();
		return data;
	} catch (error) {
		console.error('API Ninjas nutrition call failed:', error);
		throw error;
	}
}
