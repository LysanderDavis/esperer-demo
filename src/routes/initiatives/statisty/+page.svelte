<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import type { User } from '@supabase/supabase-js';
	import Typography from '$lib/components/Typography.svelte';

	let user: User | null = null;
	let height_cm = '';
	let weight_kg = '';
	let sleep_hours = '';
	let hydration_liters = '';
	let carbon_footprint = '';
	let insights: any = null;
	let loading = false;

	async function calculateInsights() {
		if (!user) return;

		loading = true;
		try {
			// Save to Supabase
			const { error } = await supabase.from('user_data').insert({
				user_id: user.id,
				height_cm: parseInt(height_cm),
				weight_kg: parseInt(weight_kg),
				sleep_hours: parseFloat(sleep_hours),
				hydration_liters: parseFloat(hydration_liters),
				carbon_footprint: parseFloat(carbon_footprint)
			});

			if (error) throw error;

			// Calculate BMI and generate insights
			const bmi = parseInt(weight_kg) / Math.pow(parseInt(height_cm) / 100, 2);
			let bmiCategory = '';
			let bmiTips = [];

			if (bmi < 18.5) {
				bmiCategory = 'Underweight';
				bmiTips = ['Increase caloric intake', 'Focus on protein-rich foods', 'Consult a nutritionist'];
			} else if (bmi < 25) {
				bmiCategory = 'Normal weight';
				bmiTips = ['Maintain balanced diet', 'Regular exercise', 'Stay consistent'];
			} else if (bmi < 30) {
				bmiCategory = 'Overweight';
				bmiTips = ['Monitor portion sizes', 'Increase physical activity', 'Choose whole foods'];
			} else {
				bmiCategory = 'Obese';
				bmiTips = ['Seek medical advice', 'Start with walking', 'Focus on whole foods'];
			}

			// Sleep tips
			const sleepTips = [];
			if (parseFloat(sleep_hours) < 7) {
				sleepTips.push(
					'Aim for 7-9 hours of sleep',
					'Create a bedtime routine',
					'Limit screen time before bed'
				);
			} else if (parseFloat(sleep_hours) > 9) {
				sleepTips.push('Consider sleep quality', 'Maintain consistent schedule', 'Exercise regularly');
			} else {
				sleepTips.push('Great sleep duration!', 'Maintain your routine', 'Monitor sleep quality');
			}

			// Hydration tips
			const hydrationTips = [];
			if (parseFloat(hydration_liters) < 2) {
				hydrationTips.push(
					'Increase water intake',
					'Set hydration reminders',
					'Carry a water bottle'
				);
			} else {
				hydrationTips.push('Great hydration!', 'Maintain intake', 'Monitor urine color');
			}

			// Carbon footprint tips
			const carbonFootprintTips = [];
			if (parseFloat(carbon_footprint) > 4) {
				carbonFootprintTips.push(
					'Use public transport',
					'Reduce meat consumption',
					'Choose local products'
				);
			} else {
				carbonFootprintTips.push(
					'Great eco-consciousness!',
					'Share your practices',
					'Look for new ways to improve'
				);
			}

			insights = {
				bmi: bmi.toFixed(1),
				bmiCategory,
				bmiTips,
				sleepTips,
				hydrationTips,
				carbonFootprintTips
			};
		} catch (error) {
			console.error('Error:', error);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();
		user = currentUser;
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-[#f9f7f4] to-[#f5e4d7] px-6 pt-32 pb-16">
	<div class="mx-auto max-w-4xl">
		<Typography variant="h1" className="mb-8 text-[#9d5d2c]">Statisty Health Tracker</Typography>

		{#if user}
			<div class="rounded-xl bg-white p-8 shadow-lg">
				<form
					on:submit|preventDefault={calculateInsights}
					class="grid grid-cols-1 gap-6 md:grid-cols-2"
				>
					<div>
						<label for="height" class="block text-sm font-medium text-gray-700">Height (cm)</label>
						<input
							type="number"
							id="height"
							bind:value={height_cm}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9d5d2c] focus:ring-[#9d5d2c]"
						/>
					</div>

					<div>
						<label for="weight" class="block text-sm font-medium text-gray-700">Weight (kg)</label>
						<input
							type="number"
							id="weight"
							bind:value={weight_kg}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9d5d2c] focus:ring-[#9d5d2c]"
						/>
					</div>

					<div>
						<label for="sleep" class="block text-sm font-medium text-gray-700">Sleep (hours)</label>
						<input
							type="number"
							id="sleep"
							bind:value={sleep_hours}
							step="0.1"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9d5d2c] focus:ring-[#9d5d2c]"
						/>
					</div>

					<div>
						<label for="hydration" class="block text-sm font-medium text-gray-700"
							>Hydration (liters)</label
						>
						<input
							type="number"
							id="hydration"
							bind:value={hydration_liters}
							step="0.1"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9d5d2c] focus:ring-[#9d5d2c]"
						/>
					</div>

					<div class="md:col-span-2">
						<label for="carbon" class="block text-sm font-medium text-gray-700"
							>Carbon Footprint (tons CO2/year)</label
						>
						<input
							type="number"
							id="carbon"
							bind:value={carbon_footprint}
							step="0.1"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9d5d2c] focus:ring-[#9d5d2c]"
						/>
					</div>

					<button
						type="submit"
						class="md:col-span-2 rounded-md bg-[#9d5d2c] px-4 py-2 text-white hover:bg-[#8a4f23] focus:outline-none focus:ring-2 focus:ring-[#9d5d2c] focus:ring-offset-2"
						disabled={loading}
					>
						{loading ? 'Calculating...' : 'Calculate Insights'}
					</button>
				</form>

				{#if insights}
					<div class="mt-8 space-y-6">
						<div class="rounded-lg bg-[#f5e4d7] p-6">
							<Typography variant="h2" className="mb-2 text-[#9d5d2c]">BMI Results</Typography>
							<p class="mb-2">Your BMI: {insights.bmi} ({insights.bmiCategory})</p>
							<ul class="list-inside list-disc">
								{#each insights.bmiTips as tip}
									<li>{tip}</li>
								{/each}
							</ul>
						</div>

						<div class="rounded-lg bg-[#f5e4d7] p-6">
							<Typography variant="h2" className="mb-2 text-[#9d5d2c]">Sleep Insights</Typography>
							<ul class="list-inside list-disc">
								{#each insights.sleepTips as tip}
									<li>{tip}</li>
								{/each}
							</ul>
						</div>

						<div class="rounded-lg bg-[#f5e4d7] p-6">
							<Typography variant="h2" className="mb-2 text-[#9d5d2c]">Hydration Tips</Typography>
							<ul class="list-inside list-disc">
								{#each insights.hydrationTips as tip}
									<li>{tip}</li>
								{/each}
							</ul>
						</div>

						<div class="rounded-lg bg-[#f5e4d7] p-6">
							<Typography variant="h2" className="mb-2 text-[#9d5d2c]"
								>Carbon Footprint Suggestions</Typography
							>
							<ul class="list-inside list-disc">
								{#each insights.carbonFootprintTips as tip}
									<li>{tip}</li>
								{/each}
							</ul>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="rounded-xl bg-white p-8 text-center shadow-lg">
				<Typography variant="h2" className="mb-4 text-[#9d5d2c]">Please Sign In</Typography>
				<p class="text-gray-600">
					You need to be signed in to use the Statisty Health Tracker. Please sign in or create an
					account to continue.
				</p>
			</div>
		{/if}
	</div>
</div>