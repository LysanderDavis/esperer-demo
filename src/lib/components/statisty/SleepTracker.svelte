<!-- src/lib/components/statisty/SleepTracker.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';

	interface SleepData {
		bedtime: string;
		wakeTime: string;
		totalSleep: number;
		quality: number;
		date: string;
		score: number;
		category: string;
	}

	let bedtime = '22:30';
	let wakeTime = '07:00';
	let quality = 7;
	let sleepData: SleepData | null = null;
	let loading = false;
	let user: any = null;
	let recentSleep: SleepData[] = [];

	function calculateSleep(bedtime: string, wakeTime: string, quality: number): SleepData {
		const bedDate = new Date(`2000-01-01 ${bedtime}`);
		let wakeDate = new Date(`2000-01-01 ${wakeTime}`);

		// Handle overnight sleep
		if (wakeDate <= bedDate) {
			wakeDate = new Date(`2000-01-02 ${wakeTime}`);
		}

		const totalMinutes = (wakeDate.getTime() - bedDate.getTime()) / (1000 * 60);
		const totalHours = totalMinutes / 60;

		// Calculate sleep score based on duration and quality
		let durationScore = 0;
		if (totalHours >= 7 && totalHours <= 9) {
			durationScore = 100;
		} else if (totalHours >= 6 && totalHours < 7) {
			durationScore = 80;
		} else if (totalHours >= 5 && totalHours < 6) {
			durationScore = 60;
		} else {
			durationScore = 40;
		}

		const qualityScore = (quality / 10) * 100;
		const overallScore = Math.round(durationScore * 0.6 + qualityScore * 0.4);

		let category = '';
		if (overallScore >= 85) category = 'Excellent';
		else if (overallScore >= 70) category = 'Good';
		else if (overallScore >= 55) category = 'Fair';
		else category = 'Poor';

		return {
			bedtime,
			wakeTime,
			totalSleep: Math.round(totalHours * 10) / 10,
			quality,
			date: new Date().toISOString().split('T')[0],
			score: overallScore,
			category
		};
	}

	function getCategoryColor(category: string): string {
		switch (category) {
			case 'Excellent':
				return 'bg-green-500';
			case 'Good':
				return 'bg-[#9d5d2c]';
			case 'Fair':
				return 'bg-yellow-500';
			case 'Poor':
				return 'bg-red-500';
			default:
				return 'bg-gray-500';
		}
	}

	function getCategoryBgColor(score: number): string {
		if (score >= 85) return 'bg-green-100 text-green-800';
		if (score >= 70) return 'bg-[#9d5d2c]/10 text-[#9d5d2c]';
		if (score >= 55) return 'bg-yellow-100 text-yellow-800';
		return 'bg-red-100 text-red-800';
	}

	async function handleSave() {
		loading = true;
		try {
			sleepData = calculateSleep(bedtime, wakeTime, quality);

			if (user) {
				await supabase.from('statisty_metrics').insert({
					user_id: user.id,
					metric: 'sleep',
					data: sleepData
				});

				// Refresh recent sleep data
				await loadRecentSleep();
			}
		} catch (error) {
			console.error('Error saving sleep data:', error);
		} finally {
			loading = false;
		}
	}

	async function loadRecentSleep() {
		if (!user) return;

		const { data } = await supabase
			.from('statisty_metrics')
			.select('data, created_at')
			.eq('user_id', user.id)
			.eq('metric', 'sleep')
			.order('created_at', { ascending: false })
			.limit(7);

		if (data) {
			recentSleep = data.map((item) => ({
				...item.data,
				date: new Date(item.created_at).toLocaleDateString()
			}));
		}
	}

	onMount(async () => {
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();
		user = currentUser;

		if (user) {
			await loadRecentSleep();

			// Load today's sleep data if available
			const today = new Date().toISOString().split('T')[0];
			const todayData = recentSleep.find((sleep) => sleep.date === new Date().toLocaleDateString());
			if (todayData) {
				sleepData = todayData;
				bedtime = todayData.bedtime;
				wakeTime = todayData.wakeTime;
				quality = todayData.quality;
			}
		}

		// Auto-calculate when values change
		sleepData = calculateSleep(bedtime, wakeTime, quality);
	});

	// Reactive calculation
	$: if (bedtime && wakeTime && quality) {
		sleepData = calculateSleep(bedtime, wakeTime, quality);
	}
</script>

<div class="h-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
	<div class="mb-4 flex items-center">
		<span class="mr-2 text-2xl">😴</span>
		<h3 class="text-xl font-semibold text-gray-800">Sleep Tracker</h3>
	</div>

	<div class="space-y-4">
		<!-- Sleep Input Form -->
		<div class="grid grid-cols-1 gap-4">
			<div>
				<label class="mb-2 block text-sm font-medium text-[#9d5d2c]"> Bedtime </label>
				<input
					type="time"
					bind:value={bedtime}
					class="w-full rounded-lg border border-gray-300 p-3 transition-colors duration-200 focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
				/>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium text-[#9d5d2c]"> Wake Time </label>
				<input
					type="time"
					bind:value={wakeTime}
					class="w-full rounded-lg border border-gray-300 p-3 transition-colors duration-200 focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
				/>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium text-[#9d5d2c]"> Sleep Quality (1-10) </label>
				<input
					type="range"
					bind:value={quality}
					min="1"
					max="10"
					class="slider-thumb h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
					style="background: linear-gradient(to right, #9d5d2c 0%, #9d5d2c {(quality / 10) *
						100}%, #e5e7eb {(quality / 10) * 100}%, #e5e7eb 100%)"
				/>
				<div class="mt-1 flex justify-between text-xs text-gray-500">
					<span>Poor (1)</span>
					<span class="font-medium text-[#9d5d2c]">{quality}</span>
					<span>Excellent (10)</span>
				</div>
			</div>
		</div>

		{#if user}
			<button
				on:click={handleSave}
				disabled={loading}
				class="w-full rounded-lg bg-[#9d5d2c] px-4 py-3 font-medium text-white transition-colors hover:bg-[#7d4a22] disabled:bg-gray-400"
			>
				{loading ? 'Saving...' : 'Save Sleep Data'}
			</button>
		{/if}

		<!-- Sleep Analysis -->
		{#if sleepData}
			<div
				class="mt-6 rounded-lg border border-[#9d5d2c]/20 bg-gradient-to-r from-[#9d5d2c]/5 to-[#9d5d2c]/10 p-4"
			>
				<div class="mb-4 text-center">
					<div class="mb-1 text-3xl font-bold text-gray-800">
						{sleepData.totalSleep}h
					</div>
					<div class="mb-2 text-sm text-gray-600">Total Sleep</div>

					<div
						class="inline-block rounded-full px-3 py-1 text-sm font-medium text-white {getCategoryColor(
							sleepData.category
						)}"
					>
						{sleepData.category} ({sleepData.score}%)
					</div>
				</div>

				<!-- Sleep Stats -->
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div class="rounded border border-[#9d5d2c]/10 bg-white p-2 text-center">
						<div class="font-medium text-[#9d5d2c]">🛏️ Bedtime</div>
						<div class="text-gray-600">{sleepData.bedtime}</div>
					</div>
					<div class="rounded border border-[#9d5d2c]/10 bg-white p-2 text-center">
						<div class="font-medium text-[#9d5d2c]">⏰ Wake Time</div>
						<div class="text-gray-600">{sleepData.wakeTime}</div>
					</div>
				</div>

				<!-- Sleep Quality Visual -->
				<div class="mt-4">
					<div class="mb-1 flex justify-between text-xs text-gray-600">
						<span>Sleep Quality</span>
						<span>{sleepData.quality}/10</span>
					</div>
					<div class="h-2 w-full rounded-full bg-gray-200">
						<div
							class="h-2 rounded-full bg-[#9d5d2c] transition-all duration-500"
							style="width: {(sleepData.quality / 10) * 100}%"
						></div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Recent Sleep History -->
		{#if recentSleep.length > 0}
			<div class="mt-6">
				<h4 class="mb-3 font-medium text-[#9d5d2c]">Recent Sleep (7 days)</h4>
				<div class="space-y-2">
					{#each recentSleep.slice(0, 5) as sleep}
						<div
							class="flex items-center justify-between rounded border border-gray-100 bg-gray-50 p-2 text-sm"
						>
							<span class="text-gray-600">{sleep.date}</span>
							<div class="flex items-center space-x-2">
								<span class="font-medium">{sleep.totalSleep}h</span>
								<span class="rounded px-2 py-1 text-xs {getCategoryBgColor(sleep.score)}">
									{sleep.score}%
								</span>
							</div>
						</div>
					{/each}
				</div>

				<!-- Weekly Average -->
				{#if recentSleep.length >= 3}
					<div class="mt-3 rounded-lg border border-[#9d5d2c]/20 bg-[#9d5d2c]/10 p-3">
						<div class="text-sm font-medium text-[#9d5d2c]">Weekly Average</div>
						<div class="text-[#9d5d2c]/80">
							{Math.round(
								(recentSleep.reduce((sum, sleep) => sum + sleep.totalSleep, 0) /
									recentSleep.length) *
									10
							) / 10}h per night
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.slider-thumb::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #9d5d2c;
		cursor: pointer;
		border: 2px solid #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.slider-thumb::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #9d5d2c;
		cursor: pointer;
		border: 2px solid #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}
</style>
