<!-- src/lib/components/statisty/CarbonEstimator.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { createStatistyAPI } from '$lib/api/index.js';
	import { supabase } from '$lib/supabaseClient.js';
	import {
		calculateCarbonFootprint,
		carbonTips,
		getCategoryColor,
		getProgressWidth,
		type CarbonInputs,
		type CarbonFootprintData
	} from '$lib/api/statisty/carbon.js';

	// Form inputs
	let inputs: CarbonInputs = {
		carKm: 0,
		publicTransportKm: 0,
		bikeKm: 0,
		walkKm: 0,
		electricityKwh: 0,
		gasUsage: 0,
		heatingUsage: 0,
		meatServings: 0,
		dairyServings: 0,
		vegetableServings: 0,
		fishServings: 0
	};

	// State management
	let currentCalculation: CarbonFootprintData | null = null;
	let historicalData: CarbonFootprintData[] = [];
	let loading = false;
	let saving = false;
	let error = '';
	let showTips = false;
	let activeTab = 'transport';

	// API instance
	const api = createStatistyAPI(supabase);

	// Reactive calculation
	$: if (Object.values(inputs).some((v) => v > 0)) {
		currentCalculation = calculateCarbonFootprint(inputs);
	}

	// Load historical data
	onMount(async () => {
		await loadHistoricalData();
	});

	async function loadHistoricalData() {
		try {
			const user = (await supabase.auth.getUser()).data.user;
			if (user) {
				historicalData = await api.getCarbonData(user.id, 7);
			}
		} catch (err) {
			console.error('Error loading historical data:', err);
		}
	}

	async function saveCalculation() {
		if (!currentCalculation) return;

		saving = true;
		error = '';

		try {
			const user = (await supabase.auth.getUser()).data.user;
			if (!user) {
				error = 'Please log in to save your carbon footprint data';
				return;
			}

			await api.saveCarbonData(user.id, inputs);
			await loadHistoricalData();

			// Show success message briefly
			error = 'Data saved successfully!';
			setTimeout(() => {
				if (error === 'Data saved successfully!') error = '';
			}, 3000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save data';
		} finally {
			saving = false;
		}
	}

	function resetForm() {
		inputs = {
			carKm: 0,
			publicTransportKm: 0,
			bikeKm: 0,
			walkKm: 0,
			electricityKwh: 0,
			gasUsage: 0,
			heatingUsage: 0,
			meatServings: 0,
			dairyServings: 0,
			vegetableServings: 0,
			fishServings: 0
		};
		currentCalculation = null;
	}

	function getAverageEmissions(): number {
		if (historicalData.length === 0) return 0;
		return historicalData.reduce((sum, data) => sum + data.total, 0) / historicalData.length;
	}

	const tabs = [
		{ id: 'transport', label: 'Transport', icon: '🚗' },
		{ id: 'energy', label: 'Energy', icon: '⚡' },
		{ id: 'food', label: 'Food', icon: '🍽️' }
	];
</script>

<div class="h-full rounded-xl bg-white p-6 shadow-lg">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center">
			<span class="mr-2 text-2xl">🌱</span>
			<h3 class="text-xl font-semibold text-gray-800">Carbon Footprint Calculator</h3>
		</div>
		<div class="flex space-x-2">
			<button
				on:click={() => (showTips = !showTips)}
				class="text-sm text-green-600 hover:text-green-700"
				title="Toggle tips"
			>
				💡 Tips
			</button>
			<button
				on:click={resetForm}
				class="text-sm text-red-500 hover:text-red-600"
				title="Reset form"
			>
				🔄 Reset
			</button>
		</div>
	</div>

	<!-- Current Calculation Display -->
	{#if currentCalculation}
		<div class="mb-6 rounded-lg bg-gray-50 p-4">
			<div class="mb-3 text-center">
				<div class="text-3xl font-bold text-gray-800">
					{currentCalculation.total} kg CO₂
				</div>
				<div class="text-sm text-gray-600">Today's Footprint</div>
			</div>

			<div class="mb-3 grid grid-cols-3 gap-2 text-center text-sm">
				<div class="rounded bg-blue-100 p-2">
					<div class="font-medium text-blue-600">{currentCalculation.transport}kg</div>
					<div class="text-blue-500">Transport</div>
				</div>
				<div class="rounded bg-yellow-100 p-2">
					<div class="font-medium text-yellow-600">{currentCalculation.energy}kg</div>
					<div class="text-yellow-500">Energy</div>
				</div>
				<div class="rounded bg-green-100 p-2">
					<div class="font-medium text-green-600">{currentCalculation.food}kg</div>
					<div class="text-green-500">Food</div>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<span
					class="rounded-full px-3 py-1 text-sm font-medium text-white {getCategoryColor(
						currentCalculation.category
					)}"
				>
					{currentCalculation.category}
				</span>
				<button
					on:click={saveCalculation}
					disabled={saving}
					class="rounded-lg bg-[#9d5d2c] px-4 py-2 text-sm text-white transition-colors hover:bg-[#8a4f24] disabled:opacity-50"
				>
					{saving ? 'Saving...' : 'Save Data'}
				</button>
			</div>
		</div>
	{/if}

	<!-- Error/Success Messages -->
	{#if error}
		<div
			class="mb-4 rounded-lg p-3 text-sm {error.includes('success')
				? 'bg-green-50 text-green-700'
				: 'bg-red-50 text-red-700'}"
		>
			{error}
		</div>
	{/if}

	<!-- Input Tabs -->
	<div class="mb-6">
		<!-- Tab Headers -->
		<div class="mb-4 flex rounded-lg bg-gray-100 p-1">
			{#each tabs as tab}
				<button
					on:click={() => (activeTab = tab.id)}
					class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors {activeTab ===
					tab.id
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-600 hover:text-gray-900'}"
				>
					<span class="mr-1">{tab.icon}</span>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Tab Content -->
		<div class="space-y-4">
			{#if activeTab === 'transport'}
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Car (km)</label>
						<input
							type="number"
							bind:value={inputs.carKm}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Public Transport (km)</label
						>
						<input
							type="number"
							bind:value={inputs.publicTransportKm}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Cycling (km)</label>
						<input
							type="number"
							bind:value={inputs.bikeKm}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Walking (km)</label>
						<input
							type="number"
							bind:value={inputs.walkKm}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
				</div>
			{:else if activeTab === 'energy'}
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Electricity (kWh)</label>
						<input
							type="number"
							bind:value={inputs.electricityKwh}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Gas Usage (m³)</label>
						<input
							type="number"
							bind:value={inputs.gasUsage}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
					<div class="col-span-2">
						<label class="mb-1 block text-sm font-medium text-gray-700">Heating/Cooling (kWh)</label
						>
						<input
							type="number"
							bind:value={inputs.heatingUsage}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
				</div>
			{:else if activeTab === 'food'}
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Meat Servings</label>
						<input
							type="number"
							bind:value={inputs.meatServings}
							min="0"
							step="0.5"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Dairy Servings</label>
						<input
							type="number"
							bind:value={inputs.dairyServings}
							min="0"
							step="0.5"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Vegetable Servings</label>
						<input
							type="number"
							bind:value={inputs.vegetableServings}
							min="0"
							step="0.5"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Fish Servings</label>
						<input
							type="number"
							bind:value={inputs.fishServings}
							min="0"
							step="0.5"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#9d5d2c]"
							placeholder="0"
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Historical Data -->
	{#if historicalData.length > 0}
		<div class="mb-4 border-t pt-4">
			<h4 class="mb-3 font-medium text-gray-800">Recent History</h4>
			<div class="max-h-32 space-y-2 overflow-y-auto">
				{#each historicalData.slice(0, 3) as data}
					<div class="flex items-center justify-between rounded bg-gray-50 p-2 text-sm">
						<div class="flex items-center space-x-2">
							<span class="text-xs text-gray-500">{data.date}</span>
							<span
								class="rounded px-2 py-1 text-xs font-medium text-white {getCategoryColor(
									data.category
								)}"
							>
								{data.category}
							</span>
						</div>
						<div class="font-medium text-gray-800">{data.total} kg CO₂</div>
					</div>
				{/each}
			</div>
			{#if historicalData.length > 1}
				<div class="mt-2 text-xs text-gray-600">
					7-day average: <span class="font-medium">{getAverageEmissions().toFixed(2)} kg CO₂</span>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Carbon Reduction Tips -->
	{#if showTips}
		<div class="border-t pt-4">
			<h4 class="mb-3 font-medium text-gray-800">💡 Quick Tips</h4>
			<div class="max-h-40 space-y-2 overflow-y-auto">
				{#each carbonTips.slice(0, 3) as tip}
					<div class="rounded bg-green-50 p-3 text-sm">
						<div class="flex items-start space-x-2">
							<span class="text-lg">{tip.icon}</span>
							<div>
								<div class="font-medium text-green-800">{tip.title}</div>
								<div class="text-green-600">{tip.description}</div>
								<div class="mt-1 text-xs font-medium text-green-500">{tip.impact}</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
