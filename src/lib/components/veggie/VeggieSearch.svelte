<!-- src/lib/components/veggie/VeggieSearch.svelte -->
<script lang="ts">
	import { searchQuery, showFilters, isLoading, veggieActions } from '$lib/stores/veggie.js';
	import { onMount } from 'svelte';

	let searchInput: HTMLInputElement;
	let addressInput: HTMLInputElement;
	let showAddressSearch = false;

	onMount(() => {
		// Focus search input on mount
		if (searchInput) {
			searchInput.focus();
		}
	});

	async function handleAddressSearch() {
		const address = addressInput.value.trim();
		if (!address) return;

		const success = await veggieActions.searchByAddress(address);
		if (success) {
			showAddressSearch = false;
			addressInput.value = '';
		} else {
			alert('Address not found. Please try a different address.');
		}
	}

	function handleAddressKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleAddressSearch();
		}
	}

	function toggleAddressSearch() {
		showAddressSearch = !showAddressSearch;
		if (showAddressSearch && addressInput) {
			setTimeout(() => addressInput.focus(), 100);
		}
	}
</script>

<div class="mb-4 rounded-lg bg-white p-4 shadow-lg">
	<!-- Main Search Bar -->
	<div class="mb-3 flex gap-2">
		<div class="relative flex-1">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					></path>
				</svg>
			</div>
			<input
				bind:this={searchInput}
				bind:value={$searchQuery}
				type="text"
				placeholder="Search venues, cuisine, or dishes..."
				class="block w-full rounded-lg border border-gray-300 bg-white py-3 pr-3 pl-10 leading-5 placeholder-gray-500 focus:border-green-500 focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:outline-none"
			/>
		</div>

		<!-- Filter Toggle Button -->
		<button
			class="relative rounded-lg bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200 {$showFilters
				? 'bg-green-50 text-green-700 ring-2 ring-green-500'
				: ''}"
			on:click={veggieActions.toggleFilters}
			aria-label="Toggle filters"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
				/>
			</svg>
		</button>
	</div>

	<!-- Secondary Action Buttons -->
	<div class="flex gap-2">
		<!-- Location Search Toggle -->
		<button
			class="flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 {showAddressSearch
				? 'bg-blue-50 text-blue-700 ring-2 ring-blue-500'
				: ''}"
			on:click={toggleAddressSearch}
		>
			<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
				></path>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
				></path>
			</svg>
			Search Location
		</button>

		<!-- Use My Location Button -->
		<button
			class="flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
			on:click={veggieActions.initializeLocation}
			disabled={$isLoading}
		>
			{#if $isLoading}
				<div
					class="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
				></div>
			{:else}
				<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
					></path>
				</svg>
			{/if}
			Use My Location
		</button>

		<!-- Quick Filters -->
		<div class="ml-auto flex gap-1">
			<button
				class="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
				on:click={() => veggieActions.updateFilter({ vegetarian_types: ['fully_veg'] })}
			>
				🌱 Fully Veg
			</button>
			<button
				class="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
				on:click={() => veggieActions.updateFilter({ vegetarian_types: ['vegan_only'] })}
			>
				🌿 Vegan
			</button>
		</div>
	</div>

	<!-- Address Search Expandable -->
	{#if showAddressSearch}
		<div class="mt-3 rounded-lg border bg-gray-50 p-3">
			<label for="search by address or landmark" class="mb-2 block text-sm font-medium text-gray-700">
				Search by Address or Landmark
			</label>
			<div class="flex gap-2">
				<input
					bind:this={addressInput}
					type="text"
					placeholder="Enter address, landmark, or area name..."
					class="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					on:keydown={handleAddressKeydown}
				/>
				<button
					class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
					on:click={handleAddressSearch}
					disabled={$isLoading}
				>
					{#if $isLoading}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
					{:else}
						Search
					{/if}
				</button>
			</div>
			<p class="mt-2 text-xs text-gray-600">
				Try: "Tashkent city center", "Samarkand Registan", "Bukhara old town"
			</p>
		</div>
	{/if}
</div>
