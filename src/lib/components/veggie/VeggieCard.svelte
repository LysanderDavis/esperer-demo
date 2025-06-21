<!-- src/lib/components/veggie/VenueCard.svelte -->
<script lang="ts">
	import type { VeggieVenue } from '$lib/types/veggie.js';
	import { userLocation, veggieActions } from '$lib/stores/veggie.js';
	import { VeggieAPI } from '$lib/api/veggie/index.js';

	export let venue: VeggieVenue;
	export let compact = false;

	// Calculate distance if user location is available
	$: distance = $userLocation
		? VeggieAPI.calculateDistance(
				$userLocation.latitude,
				$userLocation.longitude,
				venue.latitude,
				venue.longitude
			)
		: null;

	// Venue type styling
	const typeConfig = {
		fully_veg: {
			color: 'bg-green-100 text-green-800',
			label: 'Fully Vegetarian',
			icon: '🌱'
		},
		veg_friendly: {
			color: 'bg-yellow-100 text-yellow-800',
			label: 'Veg Friendly',
			icon: '🥗'
		},
		vegan_only: {
			color: 'bg-emerald-100 text-emerald-800',
			label: 'Vegan Only',
			icon: '🌿'
		}
	};

	const config = typeConfig[venue.vegetarian_type];

	function handleClick() {
		veggieActions.selectVenue(venue);
	}

	function handleDirections() {
		if (venue.latitude && venue.longitude) {
			const url = `https://www.openstreetmap.org/directions?from=&to=${venue.latitude},${venue.longitude}`;
			window.open(url, '_blank');
		}
	}
</script>

<div
	class="cursor-pointer rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg {compact
		? 'p-3'
		: 'p-4'}"
	on:click={handleClick}
	on:keydown={(e) => e.key === 'Enter' && handleClick()}
	role="button"
	tabindex="0"
>
	<!-- Header -->
	<div class="mb-2 flex items-start justify-between">
		<div class="min-w-0 flex-1">
			<h3 class="truncate text-lg font-semibold text-gray-900">{venue.name}</h3>
			<p class="truncate text-sm text-gray-600">{venue.address}</p>
		</div>

		{#if venue.verified}
			<div class="ml-2 flex-shrink-0">
				<span
					class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
				>
					<svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						></path>
					</svg>
					Verified
				</span>
			</div>
		{/if}
	</div>

	<!-- Type and Cuisine -->
	<div class="mb-3 flex items-center gap-2">
		<span class="inline-flex items-center rounded-full px-2 py-1 text-xs {config.color}">
			<span class="mr-1">{config.icon}</span>
			{config.label}
		</span>

		{#if venue.cuisine_type && venue.cuisine_type !== 'unknown'}
			<span
				class="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 capitalize"
			>
				{venue.cuisine_type}
			</span>
		{/if}
	</div>

	<!-- Rating and Distance -->
	<div class="mb-3 flex items-center justify-between">
		<div class="flex items-center gap-1">
			<div class="flex text-yellow-400">
				{#each Array(5) as _, i}
					{#if i < Math.floor(venue.rating)}
						<span>★</span>
					{:else}
						<span class="text-gray-300">☆</span>
					{/if}
				{/each}
			</div>
			<span class="text-sm text-gray-600">
				{venue.rating > 0 ? venue.rating.toFixed(1) : 'No rating'}
				{#if venue.review_count > 0}
					({venue.review_count})
				{/if}
			</span>
		</div>

		{#if distance !== null}
			<span class="text-sm text-gray-600">
				{distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
			</span>
		{/if}
	</div>

	{#if !compact}
		<!-- Description -->
		{#if venue.description}
			<p class="mb-3 line-clamp-2 text-sm text-gray-600">{venue.description}</p>
		{/if}

		<!-- Tags -->
		{#if venue.tags && venue.tags.length > 0}
			<div class="mb-3 flex flex-wrap gap-1">
				{#each venue.tags.slice(0, 3) as tag}
					<span class="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
						{tag.replace('diet:', '').replace('cuisine:', '')}
					</span>
				{/each}
				{#if venue.tags.length > 3}
					<span class="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
						+{venue.tags.length - 3} more
					</span>
				{/if}
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex gap-2 border-t border-gray-100 pt-2">
			<button
				class="flex-1 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
				on:click|stopPropagation={handleClick}
			>
				View Details
			</button>

			<button
				class="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
				on:click|stopPropagation={handleDirections}
				title="Get Directions"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
					></path>
				</svg>
			</button>

			{#if venue.phone}
				<button
					class="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
					on:click|stopPropagation={() => window.open(`tel:${venue.phone}`, '_self')}
					title="Call"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
						></path>
					</svg>
				</button>
			{/if}

			{#if venue.website}
				<button
					class="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
					on:click|stopPropagation={() => window.open(venue.website, '_blank')}
					title="Visit Website"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						></path>
					</svg>
				</button>
			{/if}
		</div>
	{/if}
</div>
