<!-- src/lib/components/statisty/HydrationTracker.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';

	interface HydrationData {
		dailyGoal: number;
		currentIntake: number;
		entries: Array<{
			amount: number;
			time: string;
			type: string;
		}>;
		percentage: number;
		date: string;
	}

	let dailyGoal = 2000; // ml
	let quickAmounts = [250, 500, 750, 1000]; // ml
	let hydrationData: HydrationData | null = null;
	let user: any = null;
	let loading = false;

	const drinkTypes = [
		{ name: 'Water', emoji: '💧', factor: 1.0 },
		{ name: 'Tea', emoji: '🍵', factor: 0.8 },
		{ name: 'Coffee', emoji: '☕', factor: 0.6 },
		{ name: 'Juice', emoji: '🧃', factor: 0.7 },
		{ name: 'Soda', emoji: '🥤', factor: 0.5 }
	];

	function initializeHydrationData(): HydrationData {
		return {
			dailyGoal,
			currentIntake: 0,
			entries: [],
			percentage: 0,
			date: new Date().toISOString().split('T')[0]
		};
	}

	async function addWater(amount: number, drinkType: string = 'Water') {
		if (!hydrationData) hydrationData = initializeHydrationData();

		const drink = drinkTypes.find((d) => d.name === drinkType) || drinkTypes[0];
		const effectiveAmount = Math.round(amount * drink.factor);

		const entry = {
			amount: effectiveAmount,
			time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			type: drinkType
		};

		hydrationData.entries = [...hydrationData.entries, entry];
		hydrationData.currentIntake += effectiveAmount;
		hydrationData.percentage = Math.round(
			(hydrationData.currentIntake / hydrationData.dailyGoal) * 100
		);

		if (user) {
			loading = true;
			try {
				await supabase.from('statisty_metrics').upsert(
					{
						user_id: user.id,
						metric: 'hydration',
						data: hydrationData
					},
					{
						onConflict: 'user_id,metric'
					}
				);
			} catch (error) {
				console.error('Error saving hydration data:', error);
			} finally {
				loading = false;
			}
		}
	}

	async function resetDay() {
		hydrationData = initializeHydrationData();

		if (user) {
			loading = true;
			try {
				await supabase
					.from('statisty_metrics')
					.delete()
					.eq('user_id', user.id)
					.eq('metric', 'hydration');
			} catch (error) {
				console.error('Error resetting hydration data:', error);
			} finally {
				loading = false;
			}
		}
	}

	async function loadTodayData() {
		if (!user) return;

		const today = new Date().toISOString().split('T')[0];
		const { data } = await supabase
			.from('statisty_metrics')
			.select('data, created_at')
			.eq('user_id', user.id)
			.eq('metric', 'hydration')
			.gte('created_at', today)
			.order('created_at', { ascending: false })
			.limit(1);

		if (data && data.length > 0) {
			hydrationData = data[0].data;
		} else {
			hydrationData = initializeHydrationData();
		}
	}

	onMount(async () => {
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();
		user = currentUser;

		if (user) {
			await loadTodayData();
		} else {
			hydrationData = initializeHydrationData();
		}
	});
</script>

<div class="h-full rounded-xl bg-white p-6 shadow-lg">
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center">
			<span class="mr-2 text-2xl">💧</span>
			<h3 class="text-xl font-semibold text-gray-800">Hydration Tracker</h3>
		</div>
		<button
			on:click={resetDay}
			class="text-sm text-red-500 hover:text-red-600"
			title="Reset today's data"
		>
			🔄 Reset
		</button>
	</div>

	{#if hydrationData}
		<!-- Progress Display -->
		<div class="mb-6 text-center">
			<div class="mb-2 text-3xl font-bold text-blue-600">
				{hydrationData.currentIntake}ml
			</div>
			<div class="mb-3 text-sm text-gray-600">
				of {hydrationData.dailyGoal}ml goal ({hydrationData.percentage}%)
			</div>

			<!-- Progress Bar -->
			<div class="mb-4 h-4 w-full rounded-full bg-gray-200">
				<div
					class="flex h-4 items-center justify-end rounded-full bg-gradient-to-r from-blue-400 to-blue-600 pr-2 transition-all duration-500"
					style="width: {Math.min(hydrationData.percentage, 100)}%"
				>
					{#if hydrationData.percentage >= 20}
						<span class="text-xs font-medium text-white">
							{hydrationData.percentage}%
						</span>
					{/if}
				</div>
			</div>

			<!-- Status Message -->
			<div
				class="text-sm {hydrationData.percentage >= 100
					? 'text-green-600'
					: hydrationData.percentage >= 75
						? 'text-blue-600'
						: hydrationData.percentage >= 50
							? 'text-yellow-600'
							: 'text-red-600'}"
			>
				{#if hydrationData.percentage >= 100}
					🎉 Excellent! You've reached your daily goal!
				{:else if hydrationData.percentage >= 75}
					👍 Great progress! Keep it up!
				{:else if hydrationData.percentage >= 50}
					💪 Halfway there! Stay hydrated!
				{:else}
					⚠️ Remember to drink more water today!
				{/if}
			</div>
		</div>

		<!-- Quick Add Buttons -->
		<div class="mb-6">
			<h4 class="mb-3 font-medium text-gray-800">Quick Add Water</h4>
			<div class="grid grid-cols-2 gap-2">
				{#each quickAmounts as amount}
					<button
						on:click={() => addWater(amount)}
						disabled={loading}
						class="rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:bg-gray-100"
					>
						+{amount}ml
					</button>
				{/each}
			</div>
		</div>

		<!-- Drink Types -->
		<div class="mb-6">
			<h4 class="mb-3 font-medium text-gray-800">Add Different Drinks</h4>
			<div class="grid grid-cols-2 gap-2">
				{#each drinkTypes as drink}
					<button
						on:click={() => addWater(250, drink.name)}
						disabled={loading}
						class="flex items-center justify-center space-x-1 rounded-lg bg-gray-50 p-2 text-sm transition-colors hover:bg-gray-100 disabled:bg-gray-100"
					>
						<span>{drink.emoji}</span>
						<span>{drink.name}</span>
					</button>
				{/each}
			</div>
			<div class="mt-2 text-xs text-gray-500">
				* Hydration factors applied (water = 100%, tea = 80%, etc.)
			</div>
		</div>

		<!-- Today's Entries -->
		{#if hydrationData.entries.length > 0}
			<div class="mb-4">
				<h4 class="mb-3 font-medium text-gray-800">Today's Intake</h4>
				<div class="max-h-32 space-y-2 overflow-y-auto">
					{#each hydrationData.entries.slice().reverse() as entry}
						<div class="flex items-center justify-between rounded bg-gray-50 p-2 text-sm">
							<div class="flex items-center space-x-2">
								<span>{drinkTypes.find((d) => d.name === entry.type)?.emoji || '💧'}</span>
								<span>{entry.type}</span>
							</div>
							<div class="flex items-center space-x-2">
								<span class="font-medium">{entry.amount}ml</span>
								<span class="text-gray-500">{entry.time}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Daily Goal Adjustment -->
		<div class="border-t pt-4">
			<label for="dailyGoal" class="mb-2 block text-sm font-medium text-gray-700"> Daily Goal (ml) </label>
			<input
				type="number"
				bind:value={dailyGoal}
				on:change={() => {
					if (hydrationData) {
						hydrationData.dailyGoal = dailyGoal;
						hydrationData.percentage = Math.round(
							(hydrationData.currentIntake / hydrationData.dailyGoal) * 100
						);
					}
				}}
				class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
				min="1000"
				max="5000"
				step="250"
			/>
		</div>
	{/if}
</div>
