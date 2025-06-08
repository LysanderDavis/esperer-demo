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
			const successMsg = error;
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

<div class="mx-auto max-w-4xl space-y-6 p-6">
	<!-- Header -->
	<div class="rounded-lg border border-[#9d5d2c]/20 bg-white p-6 shadow-md">
		<div class="mb-4 flex items-center justify-between">
			<div class="flex items-center">
				<div class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9d5d2c]/10">
					<span class="text-2xl">🌱</span>
				</div>
				<div>
					<h2 class="text-2xl font-bold text-[#9d5d2c]">Carbon Footprint Calculator</h2>
					<p class="text-gray-600">Track your daily environmental impact</p>
				</div>
			</div>
			<div class="flex gap-3">
				<button
					on:click={() => (showTips = !showTips)}
					class="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
				>
					{showTips ? 'Hide' : 'Show'} Tips
				</button>
				<button
					on:click={resetForm}
					class="rounded-lg bg-[#9d5d2c] px-4 py-2 text-white transition-colors hover:bg-[#8a4f24]"
				>
					Reset
				</button>
			</div>
		</div>

		<!-- Current Calculation Display -->
		{#if currentCalculation}
			<div
				class="mb-4 rounded-lg border border-[#9d5d2c]/20 bg-gradient-to-br from-[#9d5d2c]/5 to-[#9d5d2c]/10 p-5"
			>
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-semibold text-[#9d5d2c]">Today's Footprint</h3>
					<span class="text-3xl font-bold text-[#9d5d2c]">{currentCalculation.total} kg CO₂</span>
				</div>

				<div class="mb-4 grid grid-cols-3 gap-4">
					<div class="rounded-lg bg-white/50 p-3 text-center">
						<div class="text-sm font-medium text-gray-600">Transport</div>
						<div class="text-xl font-bold text-blue-600">{currentCalculation.transport} kg</div>
					</div>
					<div class="rounded-lg bg-white/50 p-3 text-center">
						<div class="text-sm font-medium text-gray-600">Energy</div>
						<div class="text-xl font-bold text-yellow-600">{currentCalculation.energy} kg</div>
					</div>
					<div class="rounded-lg bg-white/50 p-3 text-center">
						<div class="text-sm font-medium text-gray-600">Food</div>
						<div class="text-xl font-bold text-green-600">{currentCalculation.food} kg</div>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<span
						class="rounded-full px-4 py-2 text-sm font-medium text-white {getCategoryColor(
							currentCalculation.category
						)}"
					>
						{currentCalculation.category}
					</span>
					<button
						on:click={saveCalculation}
						disabled={saving}
						class="rounded-lg bg-[#9d5d2c] px-6 py-2 text-white transition-colors hover:bg-[#8a4f24] disabled:opacity-50"
					>
						{saving ? 'Saving...' : 'Save Data'}
					</button>
				</div>
			</div>
		{/if}

		<!-- Error/Success Messages -->
		{#if error}
			<div
				class="mb-4 rounded-lg border p-4 {error.includes('success')
					? 'border-green-200 bg-green-50 text-green-700'
					: 'border-red-200 bg-red-50 text-red-700'}"
			>
				{error}
			</div>
		{/if}
	</div>

	<!-- Input Tabs -->
	<div class="overflow-hidden rounded-lg border border-[#9d5d2c]/20 bg-white shadow-md">
		<!-- Tab Headers -->
		<div class="flex border-b border-[#9d5d2c]/20">
			{#each tabs as tab}
				<button
					on:click={() => (activeTab = tab.id)}
					class="flex-1 px-6 py-4 text-center font-medium transition-colors {activeTab === tab.id
						? 'bg-[#9d5d2c] text-white'
						: 'bg-gray-50 text-gray-700 hover:bg-[#9d5d2c]/10'}"
				>
					<span class="mr-2 text-lg">{tab.icon}</span>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Tab Content -->
		<div class="p-6">
			{#if activeTab === 'transport'}
				<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
					<div>
						<label for="car" class="mb-2 block text-sm font-medium text-gray-700">Car (km)</label>
						<input
							type="number"
							bind:value={inputs.carKm}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Daily car distance"
						/>
					</div>
					<div>
						<label for="publicTransport" class="mb-2 block text-sm font-medium text-gray-700"
							>Public Transport (km)</label
						>
						<input
							type="number"
							bind:value={inputs.publicTransportKm}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Bus, train, metro distance"
						/>
					</div>
					<div>
						<label for="cycling" class="mb-2 block text-sm font-medium text-gray-700"
							>Cycling (km)</label
						>
						<input
							type="number"
							bind:value={inputs.bikeKm}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Bike distance"
						/>
					</div>
					<div>
						<label for="walking" class="mb-2 block text-sm font-medium text-gray-700"
							>Walking (km)</label
						>
						<input
							type="number"
							bind:value={inputs.walkKm}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Walking distance"
						/>
					</div>
				</div>
			{:else if activeTab === 'energy'}
				<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
					<div>
						<label for="electricity" class="mb-2 block text-sm font-medium text-gray-700"
							>Electricity (kWh)</label
						>
						<input
							type="number"
							bind:value={inputs.electricityKwh}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Daily electricity usage"
						/>
					</div>
					<div>
						<label for="gasUsage" class="mb-2 block text-sm font-medium text-gray-700"
							>Gas Usage (m³)</label
						>
						<input
							type="number"
							bind:value={inputs.gasUsage}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Daily gas consumption"
						/>
					</div>
					<div class="md:col-span-2">
						<label for="heating-cooling" class="mb-2 block text-sm font-medium text-gray-700"
							>Heating/Cooling (kWh)</label
						>
						<input
							type="number"
							bind:value={inputs.heatingUsage}
							min="0"
							step="0.1"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Daily heating/cooling usage"
						/>
					</div>
				</div>
			{:else if activeTab === 'food'}
				<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
					<div>
						<label for="meatServings" class="mb-2 block text-sm font-medium text-gray-700"
							>Meat Servings</label
						>
						<input
							id="meatServings"
							type="number"
							bind:value={inputs.meatServings}
							min="0"
							step="0.5"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Daily meat servings"
						/>
					</div>
					<div>
						<label for="dairyServings" class="mb-2 block text-sm font-medium text-gray-700"
							>Dairy Servings</label
						>
						<input
							id="dairyServings"
							type="number"
							bind:value={inputs.dairyServings}
							min="0"
							step="0.5"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Daily dairy servings"
						/>
					</div>
					<div>
						<label for="vegetableServings" class="mb-2 block text-sm font-medium text-gray-700"
							>Vegetable Servings</label
						>
						<input
							id="vegetableServings"
							type="number"
							bind:value={inputs.vegetableServings}
							min="0"
							step="0.5"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Daily vegetable servings"
						/>
					</div>
					<div>
						<label for="fishServings" class="mb-2 block text-sm font-medium text-gray-700"
							>Fish Servings</label
						>
						<input
							id="fishServings"
							type="number"
							bind:value={inputs.fishServings}
							min="0"
							step="0.5"
							class="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20"
							placeholder="Daily fish servings"
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Historical Data -->
	{#if historicalData.length > 0}
		<div class="rounded-lg border border-[#9d5d2c]/20 bg-white p-6 shadow-md">
			<h3 class="mb-4 text-lg font-semibold text-[#9d5d2c]">Recent History</h3>
			<div class="space-y-3">
				{#each historicalData as data}
					<div
						class="flex items-center justify-between rounded-lg border border-[#9d5d2c]/20 bg-gradient-to-r from-[#9d5d2c]/5 to-[#9d5d2c]/10 p-4"
					>
						<div class="flex items-center space-x-4">
							<div class="text-sm font-medium text-gray-700">{data.date}</div>
							<span
								class="rounded-full px-3 py-1 text-xs font-medium text-white {getCategoryColor(
									data.category
								)}"
							>
								{data.category}
							</span>
						</div>
						<div class="flex items-center space-x-6">
							<div class="text-sm font-medium">
								<span class="text-blue-600">T: {data.transport}</span>
								<span class="ml-3 text-yellow-600">E: {data.energy}</span>
								<span class="ml-3 text-green-600">F: {data.food}</span>
							</div>
							<div class="text-lg font-bold text-[#9d5d2c]">{data.total} kg CO₂</div>
						</div>
					</div>
				{/each}
			</div>

			{#if historicalData.length > 1}
				<div class="mt-4 rounded-lg border border-[#9d5d2c]/20 bg-[#9d5d2c]/10 p-4">
					<div class="text-sm text-gray-700">
						7-day average:
						<span class="font-bold text-[#9d5d2c]">{getAverageEmissions().toFixed(2)} kg CO₂</span>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Carbon Reduction Tips -->
	{#if showTips}
		<div class="rounded-lg border border-[#9d5d2c]/20 bg-white p-6 shadow-md">
			<h3 class="mb-6 text-lg font-semibold text-[#9d5d2c]">💡 Carbon Reduction Tips</h3>
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
				{#each carbonTips as tip}
					<div
						class="rounded-lg border border-[#9d5d2c]/20 p-5 transition-all hover:bg-[#9d5d2c]/5 hover:shadow-md"
					>
						<div class="flex items-start space-x-4">
							<span class="text-2xl">{tip.icon}</span>
							<div>
								<h4 class="mb-2 font-semibold text-[#9d5d2c]">{tip.title}</h4>
								<p class="mb-3 text-sm text-gray-600">{tip.description}</p>
								<p class="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
									{tip.impact}
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
