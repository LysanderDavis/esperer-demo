<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import VeggieSearch from '$lib/components/veggie/VeggieSearch.svelte';
	import VeggieFilter from '$lib/components/veggie/VeggieFilter.svelte';
	import VeggieCard from '$lib/components/veggie/VeggieCard.svelte';
	import VeggieMap from '$lib/components/veggie/VeggieMap.svelte';
	import {
		filteredVenues,
		userLocation,
		selectedVenue,
		isLoading,
		locationPermission,
		veggieStats,
		veggieActions
	} from '$lib/stores/veggie.js';

	let showMap = true;
	let viewMode: 'list' | 'grid' = 'grid';

	onMount(async () => {
		// Try to initialize user location on load
		await veggieActions.initializeLocation();
	});

	function toggleView() {
		showMap = !showMap;
	}

	function toggleViewMode() {
		viewMode = viewMode === 'grid' ? 'list' : 'grid';
	}
</script>

<svelte:head>
	<title>Veggie - Find Vegetarian & Vegan Restaurants</title>
	<meta
		name="description"
		content="Discover vegetarian and vegan restaurants near you in Uzbekistan"
	/>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<h1 class="text-2xl font-bold text-green-600">🌱 Veggie</h1>
					<p class="ml-3 text-sm text-gray-600">Find vegetarian restaurants in Uzbekistan</p>
				</div>

				<!-- Stats -->
				{#if $veggieStats.totalVenues > 0}
					<div class="hidden items-center gap-4 text-sm text-gray-600 md:flex">
						<span>📍 {$veggieStats.totalVenues} venues</span>
						<span>🌱 {$veggieStats.fullyVeg} fully veg</span>
						<span>🌿 {$veggieStats.veganOnly} vegan</span>
						{#if $veggieStats.nearbyVenues > 0}
							<span>📍 {$veggieStats.nearbyVenues} nearby</span>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<!-- Search and Filters -->
		<VeggieSearch />
		<VeggieFilter />

		<!-- Location Permission Notice -->
		{#if $locationPermission === 'denied'}
			<div class="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
				<div class="flex">
					<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-yellow-800">Location access needed</h3>
						<p class="mt-1 text-sm text-yellow-700">
							Enable location access to find restaurants near you, or search by address instead.
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Loading State -->
		{#if $isLoading}
			<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div class="flex items-center">
					<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
					<p class="ml-3 text-blue-700">Loading restaurants...</p>
				</div>
			</div>
		{/if}

		<!-- View Controls -->
		<div class="mb-4 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<button
					class="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {showMap
						? 'bg-green-100 text-green-800'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					on:click={toggleView}
				>
					<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
						/>
					</svg>
					{showMap ? 'Hide Map' : 'Show Map'}
				</button>

				{#if !showMap}
					<button
						class="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {viewMode ===
						'grid'
							? 'bg-blue-100 text-blue-800'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						on:click={toggleViewMode}
					>
						{#if viewMode === 'grid'}
							<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 10h16M4 14h16M4 18h16"
								/>
							</svg>
							List View
						{:else}
							<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
								/>
							</svg>
							Grid View
						{/if}
					</button>
				{/if}
			</div>

			<div class="text-sm text-gray-600">
				{$filteredVenues.length} restaurant{$filteredVenues.length === 1 ? '' : 's'} found
			</div>
		</div>

		<!-- Main Content Layout -->
		<div class="flex gap-6">
			<!-- Map Section -->
			{#if showMap}
				<div class="w-1/2">
					<VeggieMap height="600px" />
				</div>
			{/if}

			<!-- Venues List/Grid -->
			<div class="flex-1">
				{#if $filteredVenues.length === 0 && !$isLoading}
					<div class="rounded-lg bg-white p-8 text-center shadow">
						<svg
							class="mx-auto h-12 w-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<h3 class="mt-2 text-lg font-medium text-gray-900">No restaurants found</h3>
						<p class="mt-1 text-gray-500">
							Try adjusting your search criteria or location to find vegetarian restaurants.
						</p>
						<div class="mt-4">
							<button
								class="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
								on:click={veggieActions.clearFilters}
							>
								Clear Filters
							</button>
						</div>
					</div>
				{:else}
					<!-- Venues Grid/List -->
					<div
						class={viewMode === 'grid' && !showMap
							? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
							: 'space-y-4'}
					>
						{#each $filteredVenues as venue (venue.id)}
							<VeggieCard {venue} compact={showMap || viewMode === 'list'} />
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Selected Venue Details Modal -->
		{#if $selectedVenue}
			<div
				class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
				on:click={({ target, currentTarget }) => {
					if (target === currentTarget) veggieActions.selectVenue(null);
				}}
				on:keydown={(e) => {
					if (e.key === 'Escape') veggieActions.selectVenue(null);
				}}
				role="dialog"
				aria-modal="true"
				tabindex="-1"
			>
				<div
					class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
				>
					<div class="mb-4 flex items-start justify-between">
						<div>
							<h2 class="text-2xl font-bold text-gray-900">{$selectedVenue.name}</h2>
							<p class="text-gray-600">{$selectedVenue.address}</p>
						</div>
						<button
							class="text-gray-400 hover:text-gray-600"
							on:click={() => veggieActions.selectVenue(null)}
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<VeggieCard venue={$selectedVenue} compact={false} />

					<div class="mt-4 flex gap-2">
						<button
							class="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
							on:click={() => {
								if ($selectedVenue?.latitude && $selectedVenue?.longitude) {
									const url = `https://www.openstreetmap.org/directions?from=&to=${$selectedVenue.latitude},${$selectedVenue.longitude}`;
									window.open(url, '_blank');
								}
							}}
						>
							Get Directions
						</button>
						{#if $selectedVenue.phone}
							<button
								class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
								on:click={() => window.open(`tel:${$selectedVenue?.phone}`, '_self')}
							>
								Call
							</button>
						{/if}
						{#if $selectedVenue.website}
							<button
								class="rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
								on:click={() => window.open($selectedVenue?.website, '_blank')}
							>
								Website
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</main>

	<!-- Footer -->
	<footer class="mt-12 border-t bg-white">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="text-center text-gray-600">
				<p class="mb-2">🌱 Veggie - Discover vegetarian and vegan restaurants in Uzbekistan</p>
				<p class="text-sm">
					Data from OpenStreetMap contributors. Help improve this app by adding vegetarian
					restaurants to OSM.
				</p>
			</div>
		</div>
	</footer>
</div>
