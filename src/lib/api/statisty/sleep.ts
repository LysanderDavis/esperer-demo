// src/lib/api/statisty/sleep.ts
export interface SleepData {
	date: string;
	bedtime: string;
	wakeTime: string;
	duration: number; // in hours
	quality: 1 | 2 | 3 | 4 | 5;
}

export interface SleepMetrics {
	averageDuration: number;
	averageQuality: number;
	sleepEfficiency: number;
	consistency: number;
}

export function calculateSleepMetrics(sleepData: SleepData[]): SleepMetrics {
	if (sleepData.length === 0) {
		return {
			averageDuration: 0,
			averageQuality: 0,
			sleepEfficiency: 0,
			consistency: 0
		};
	}

	const totalDuration = sleepData.reduce((sum, entry) => sum + entry.duration, 0);
	const totalQuality = sleepData.reduce((sum, entry) => sum + entry.quality, 0);

	const averageDuration = totalDuration / sleepData.length;
	const averageQuality = totalQuality / sleepData.length;

	// Sleep efficiency: percentage of entries with 7+ hours of sleep
	const efficientSleepCount = sleepData.filter((entry) => entry.duration >= 7).length;
	const sleepEfficiency = (efficientSleepCount / sleepData.length) * 100;

	// Consistency: how regular bedtime/wake time is (simplified calculation)
	const bedtimes = sleepData.map((entry) => parseTimeToMinutes(entry.bedtime));
	const waketimes = sleepData.map((entry) => parseTimeToMinutes(entry.wakeTime));

	const bedtimeVariance = calculateVariance(bedtimes);
	const waketimeVariance = calculateVariance(waketimes);
	const consistency = Math.max(0, 100 - (bedtimeVariance + waketimeVariance) / 2);

	return {
		averageDuration: Math.round(averageDuration * 10) / 10,
		averageQuality: Math.round(averageQuality * 10) / 10,
		sleepEfficiency: Math.round(sleepEfficiency),
		consistency: Math.round(consistency)
	};
}

function parseTimeToMinutes(timeString: string): number {
	const [hours, minutes] = timeString.split(':').map(Number);
	return hours * 60 + minutes;
}

function calculateVariance(numbers: number[]): number {
	if (numbers.length === 0) return 0;

	const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
	const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
	return Math.sqrt(variance);
}

export function getSleepRecommendation(metrics: SleepMetrics): string {
	if (metrics.averageDuration < 6) {
		return "You're getting too little sleep. Aim for 7-9 hours per night for optimal health.";
	} else if (metrics.averageDuration > 9) {
		return 'You might be oversleeping. Try to maintain 7-8 hours of sleep per night.';
	} else if (metrics.consistency < 70) {
		return 'Try to maintain a consistent sleep schedule by going to bed and waking up at the same time daily.';
	} else if (metrics.averageQuality < 3) {
		return 'Focus on improving sleep quality through better sleep hygiene and environment.';
	} else {
		return 'Great job! Your sleep patterns look healthy. Keep it up! 😴';
	}
}

export function calculateSleepDebt(sleepData: SleepData[], targetHours: number = 8): number {
	const totalActualSleep = sleepData.reduce((sum, entry) => sum + entry.duration, 0);
	const totalTargetSleep = sleepData.length * targetHours;
	const sleepDebt = Math.max(0, totalTargetSleep - totalActualSleep);

	return Math.round(sleepDebt * 10) / 10;
}

export function getSleepTrend(sleepData: SleepData[]): 'improving' | 'declining' | 'stable' {
	if (sleepData.length < 7) return 'stable';

	const recentWeek = sleepData.slice(-7);
	const previousWeek = sleepData.slice(-14, -7);

	if (previousWeek.length === 0) return 'stable';

	const recentAvg = recentWeek.reduce((sum, entry) => sum + entry.duration, 0) / recentWeek.length;
	const previousAvg =
		previousWeek.reduce((sum, entry) => sum + entry.duration, 0) / previousWeek.length;

	const difference = recentAvg - previousAvg;

	if (difference > 0.5) return 'improving';
	if (difference < -0.5) return 'declining';
	return 'stable';
}
