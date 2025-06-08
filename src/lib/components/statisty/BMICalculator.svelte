<!-- src/lib/components/statisty/BMICalculator.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';

	// BMI calculation function
	function calculateBMI(weight: number, height: number) {
		const bmi = weight / (height * height);
		let category = '';
		let color = '';

		if (bmi < 18.5) {
			category = 'Underweight';
			color = 'text-blue-600';
		} else if (bmi < 25) {
			category = 'Normal';
			color = 'text-green-600';
		} else if (bmi < 30) {
			category = 'Overweight';
			color = 'text-yellow-600';
		} else {
			category = 'Obese';
			color = 'text-red-600';
		}

		return {
			bmi: Math.round(bmi * 10) / 10,
			category,
			color
		};
	}

	let weight = 70;
	let height = 1.75;
	let loading = false;
	let result: any = null;
	let user: any = null;

	onMount(async () => {
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();
		user = currentUser;

		// Load previous data if available
		if (user) {
			const { data } = await supabase
				.from('statisty_metrics')
				.select('data')
				.eq('user_id', user.id)
				.eq('metric', 'bmi')
				.order('created_at', { ascending: false })
				.limit(1);

			if (data && data.length > 0) {
				const lastData = data[0].data;
				weight = lastData.weight || 70;
				height = lastData.height || 1.75;
				result = calculateBMI(weight, height);
			}
		}
	});

	async function handleCalculate() {
		loading = true;
		try {
			result = calculateBMI(weight, height);

			// Save to database if user is logged in
			if (user) {
				await supabase.from('statisty_metrics').insert({
					user_id: user.id,
					metric: 'bmi',
					data: {
						weight,
						height,
						bmi: result.bmi,
						category: result.category
					}
				});
			}
		} catch (error) {
			console.error('Error calculating BMI:', error);
		} finally {
			loading = false;
		}
	}

	// Auto-calculate when values change
	$: if (weight > 0 && height > 0) {
		result = calculateBMI(weight, height);
	}
</script>

<div class="h-full rounded-xl bg-white p-6 shadow-lg">
	<div class="mb-4 flex items-center">
		<span class="mr-2 text-2xl">⚖️</span>
		<h3 class="text-xl font-semibold text-gray-800">BMI Calculator</h3>
	</div>

	<div class="space-y-4">
		<div>
			<label class="mb-2 block text-sm font-medium text-gray-700"> Weight (kg) </label>
			<input
				type="number"
				bind:value={weight}
				class="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
				min="1"
				max="500"
				step="0.1"
				placeholder="Enter your weight"
			/>
		</div>

		<div>
			<label class="mb-2 block text-sm font-medium text-gray-700"> Height (m) </label>
			<input
				type="number"
				bind:value={height}
				class="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
				min="0.5"
				max="3"
				step="0.01"
				placeholder="Enter your height"
			/>
		</div>

		{#if user}
			<button
				on:click={handleCalculate}
				disabled={loading || !weight || !height}
				class="w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-gray-400"
			>
				{loading ? 'Saving...' : 'Save BMI'}
			</button>
		{/if}

		{#if result}
			<div class="mt-6 rounded-lg border bg-gray-50 p-4">
				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-gray-800">
						{result.bmi}
					</div>
					<div class="text-lg font-medium {result.color} mb-3">
						{result.category}
					</div>

					<!-- BMI Scale Visual -->
					<div class="space-y-2 text-sm">
						<div
							class="flex items-center justify-between rounded p-2 {result.category ===
							'Underweight'
								? 'bg-blue-100'
								: 'bg-gray-100'}"
						>
							<span>Underweight</span>
							<span class="font-medium">&lt; 18.5</span>
						</div>
						<div
							class="flex items-center justify-between rounded p-2 {result.category === 'Normal'
								? 'bg-green-100'
								: 'bg-gray-100'}"
						>
							<span>Normal</span>
							<span class="font-medium">18.5 - 24.9</span>
						</div>
						<div
							class="flex items-center justify-between rounded p-2 {result.category === 'Overweight'
								? 'bg-yellow-100'
								: 'bg-gray-100'}"
						>
							<span>Overweight</span>
							<span class="font-medium">25.0 - 29.9</span>
						</div>
						<div
							class="flex items-center justify-between rounded p-2 {result.category === 'Obese'
								? 'bg-red-100'
								: 'bg-gray-100'}"
						>
							<span>Obese</span>
							<span class="font-medium">≥ 30.0</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
