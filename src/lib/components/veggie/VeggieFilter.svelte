<!-- src/lib/components/veggie/VeggieFilter.svelte -->
<script lang="ts">
	import { veggieFilter, showFilters, veggieActions } from '$lib/stores/veggie.js';

	// Cuisine types
	const cuisineOptions = [
		'uzbek',
		'indian',
		'italian',
		'asian',
		'mediterranean',
		'middle_eastern',
		'mexican',
		'american',
		'chinese',
		'thai'
	];

	// Strict union type for veg types
	type VegType = 'fully_veg' | 'veg_friendly' | 'vegan_only';

	// Vegetarian type options
	const vegTypeOptions: { value: VegType; label: string; icon: string }[] = [
		{ value: 'fully_veg', label: 'Fully Vegetarian', icon: '🌱' },
		{ value: 'veg_friendly', label: 'Veg Friendly', icon: '🥗' },
		{ value: 'vegan_only', label: 'Vegan Only', icon: '🌿' }
	];

	// Dietary options
	const dietaryOptions = ['gluten_free', 'dairy_free', 'nut_free', 'halal', 'kosher'];

	function toggleCuisine(cuisine: string) {
		veggieFilter.update((filter) => ({
			...filter,
			cuisine_types: filter.cuisine_types?.includes(cuisine)
				? filter.cuisine_types.filter((c) => c !== cuisine)
				: [...(filter.cuisine_types || []), cuisine]
		}));
	}

	function toggleVegType(type: VegType) {
		veggieFilter.update((filter) => ({
			...filter,
			vegetarian_types: filter.vegetarian_types?.includes(type)
				? filter.vegetarian_types.filter((t) => t !== type)
				: [...(filter.vegetarian_types || []), type]
		}));
	}

	function toggleDietary(dietary: string) {
		veggieFilter.update((filter) => ({
			...filter,
			dietary_requirements: filter.dietary_requirements?.includes(dietary)
				? filter.dietary_requirements.filter((d) => d !== dietary)
				: [...(filter.dietary_requirements || []), dietary]
		}));
	}

	function handleRatingChange(event: Event) {
		const target = event.target as HTMLInputElement;
		veggieActions.updateFilter({ min_rating: parseFloat(target.value) });
	}

	function handleDistanceChange(event: Event) {
		const target = event.target as HTMLInputElement;
		veggieActions.updateFilter({ max_distance: parseFloat(target.value) });
	}

	function handleOpenNowChange(event: Event) {
		const target = event.target as HTMLInputElement;
		veggieActions.updateFilter({ open_now: target.checked });
	}
</script>

{#if $showFilters}
	<div class="mb-4 rounded-lg border bg-white p-4 shadow-lg">
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-semibold text-gray-900">Filters</h3>
			<button
				class="text-gray-400 hover:text-gray-600"
				on:click={veggieActions.toggleFilters}
				aria-label="Close filters"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<div class="space-y-6">
			<!-- Vegetarian Type -->
			<div>
				<h4 class="mb-3 text-sm font-medium text-gray-900">Vegetarian Type</h4>
				<div class="flex flex-wrap gap-2">
					{#each vegTypeOptions as option}
						<button
							class="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {$veggieFilter.vegetarian_types?.includes(
								option.value
							)
								? 'bg-green-100 text-green-800 ring-2 ring-green-200'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							on:click={() => toggleVegType(option.value)}
						>
							<span class="mr-1">{option.icon}</span>
							{option.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Cuisine Type -->
			<div>
				<h4 class="mb-3 text-sm font-medium text-gray-900">Cuisine</h4>
				<div class="flex flex-wrap gap-2">
					{#each cuisineOptions as cuisine}
						<button
							class="rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors {$veggieFilter.cuisine_types?.includes(
								cuisine
							)
								? 'bg-blue-100 text-blue-800 ring-2 ring-blue-200'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							on:click={() => toggleCuisine(cuisine)}
						>
							{cuisine.replace('_', ' ')}
						</button>
					{/each}
				</div>
			</div>

			<!-- Rating -->
			<div>
				<h4 class="mb-3 text-sm font-medium text-gray-900">Minimum Rating</h4>
				<div class="space-y-2">
					<input
						type="range"
						min="0"
						max="5"
						step="0.5"
						value={$veggieFilter.min_rating || 0}
						on:input={handleRatingChange}
						class="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
					/>
					<div class="flex justify-between text-sm text-gray-600">
						<span>Any</span>
						<span class="font-medium">
							{$veggieFilter.min_rating || 0}+ stars
						</span>
						<span>5 stars</span>
					</div>
				</div>
			</div>

			<!-- Distance -->
			<div>
				<h4 class="mb-3 text-sm font-medium text-gray-900">Maximum Distance</h4>
				<div class="space-y-2">
					<input
						type="range"
						min="1"
						max="50"
						step="1"
						value={$veggieFilter.max_distance || 10}
						on:input={handleDistanceChange}
						class="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
					/>
					<div class="flex justify-between text-sm text-gray-600">
						<span>1km</span>
						<span class="font-medium">
							{$veggieFilter.max_distance || 10}km
						</span>
						<span>50km</span>
					</div>
				</div>
			</div>

			<!-- Dietary Requirements -->
			<div>
				<h4 class="mb-3 text-sm font-medium text-gray-900">Dietary Requirements</h4>
				<div class="flex flex-wrap gap-2">
					{#each dietaryOptions as dietary}
						<button
							class="rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors {$veggieFilter.dietary_requirements?.includes(
								dietary
							)
								? 'bg-purple-100 text-purple-800 ring-2 ring-purple-200'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							on:click={() => toggleDietary(dietary)}
						>
							{dietary.replace('_', ' ')}
						</button>
					{/each}
				</div>
			</div>

			<!-- Open Now Toggle -->
			<div>
				<label class="flex items-center space-x-3">
					<input
						type="checkbox"
						checked={$veggieFilter.open_now || false}
						on:change={handleOpenNowChange}
						class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500"
					/>
					<span class="text-sm font-medium text-gray-900">Open now</span>
				</label>
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-2 border-t border-gray-200 pt-4">
				<button
					class="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
					on:click={veggieActions.toggleFilters}
				>
					Apply Filters
				</button>
				<button
					class="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
					on:click={veggieActions.clearFilters}
				>
					Clear All
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #16a34a;
		cursor: pointer;
		border: 2px solid #ffffff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #16a34a;
		cursor: pointer;
		border: 2px solid #ffffff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}
</style>
