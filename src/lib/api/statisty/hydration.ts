// src/lib/api/statisty/hydration.ts
export interface HydrationEntry {
	timestamp: string;
	amount: number; // in ml
	type: 'water' | 'coffee' | 'tea' | 'other';
}

export function calculateDailyHydration(entries: HydrationEntry[]): {
	total: number;
	goal: number;
	percentage: number;
} {
	const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
	const goal = 2000; // Default 2L daily goal
	const percentage = Math.min((total / goal) * 100, 100);

	return {
		total,
		goal,
		percentage: Math.round(percentage)
	};
}

export function getHydrationRecommendation(totalIntake: number, goal: number): string {
	const remaining = goal - totalIntake;

	if (remaining <= 0) {
		return "Great job! You've reached your hydration goal today! 💧";
	} else if (remaining <= 250) {
		return `Almost there! Just ${remaining}ml more to reach your goal.`;
	} else {
		return `Keep going! You need ${remaining}ml more water today.`;
	}
}

export function calculateWeeklyHydrationStats(entries: HydrationEntry[]): {
	averageDaily: number;
	bestDay: number;
	consistency: number;
} {
	const dailyTotals = new Map<string, number>();

	entries.forEach((entry) => {
		const date = entry.timestamp.split('T')[0];
		dailyTotals.set(date, (dailyTotals.get(date) || 0) + entry.amount);
	});

	const totals = Array.from(dailyTotals.values());
	const averageDaily = totals.reduce((sum, total) => sum + total, 0) / totals.length || 0;
	const bestDay = Math.max(...totals, 0);
	const consistency =
		totals.length > 0 ? (totals.filter((total) => total >= 1500).length / totals.length) * 100 : 0;

	return {
		averageDaily: Math.round(averageDaily),
		bestDay,
		consistency: Math.round(consistency)
	};
}
