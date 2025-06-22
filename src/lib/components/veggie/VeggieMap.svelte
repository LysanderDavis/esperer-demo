<!-- src/lib/components/veggie/VeggieMap.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		filteredVenues,
		userLocation,
		selectedVenue,
		veggieActions
	} from '$lib/stores/veggie.js';
	import type { VeggieVenue } from '$lib/types/veggie.js';

	let mapContainer: HTMLDivElement;
	let map: any;
	let L: any;
	let userMarker: any;
	let venueMarkers: any[] = [];

	// Props
	export let height = '400px';
	export let zoom = 13;

	// Venue type colors
	const typeColors = {
		fully_veg: '#22c55e', // Green
		veg_friendly: '#eab308', // Yellow
		vegan_only: '#16a34a' // Dark green
	};

	// Load Leaflet and initialize map
	onMount(async () => {
		try {
			// Dynamically import Leaflet
			const leafletModule = await import('leaflet');
			L = leafletModule.default;

			// Initialize map with proper z-index
			map = L.map(mapContainer, {
				zoomControl: true,
				attributionControl: true
			}).setView([41.2995, 69.2401], zoom); // Default to Tashkent

			// Add OpenStreetMap tiles
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
				maxZoom: 19
			}).addTo(map);

			// Set up event listeners
			map.on('moveend', handleMapMove);
			map.on('zoomend', handleMapMove);

			// Initialize user location if available
			if ($userLocation) {
				updateUserMarker($userLocation);
				map.setView([$userLocation.latitude, $userLocation.longitude], zoom);
			}

			// Initialize venue markers
			updateVenueMarkers($filteredVenues);
		} catch (error) {
			console.error('Error initializing map:', error);
		}
	});

	// Handle map movement
	function handleMapMove() {
		if (!map) return;

		const bounds = map.getBounds();
		const mapBounds = {
			north: bounds.getNorth(),
			south: bounds.getSouth(),
			east: bounds.getEast(),
			west: bounds.getWest()
		};

		veggieActions.updateBounds(mapBounds);
	}

	// Update user location marker
	function updateUserMarker(location: { latitude: number; longitude: number }) {
		if (!map || !L) return;

		if (userMarker) {
			map.removeLayer(userMarker);
		}

		const userIcon = L.divIcon({
			className: 'user-location-marker',
			html: `
        <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative">
          <div class="w-full h-full bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      `,
			iconSize: [16, 16],
			iconAnchor: [8, 8]
		});

		userMarker = L.marker([location.latitude, location.longitude], {
			icon: userIcon,
			title: 'Your Location'
		}).addTo(map);
	}

	// Update venue markers
	function updateVenueMarkers(venues: VeggieVenue[]) {
		if (!map || !L) return;

		// Clear existing markers
		venueMarkers.forEach((marker) => map.removeLayer(marker));
		venueMarkers = [];

		// Add new markers
		venues.forEach((venue) => {
			const color = typeColors[venue.vegetarian_type];
			const isSelected = $selectedVenue?.id === venue.id;

			const venueIcon = L.divIcon({
				className: 'venue-marker',
				html: `
          <div class="relative">
            <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
							isSelected ? 'scale-125 ring-2 ring-blue-400' : 'hover:scale-110'
						}" style="background-color: ${color}">
              <div class="w-full h-full rounded-full bg-white bg-opacity-20"></div>
            </div>
            ${
							venue.verified
								? `
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white">
                <div class="w-full h-full flex items-center justify-center">
                  <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            `
								: ''
						}
          </div>
        `,
				iconSize: [24, 24],
				iconAnchor: [12, 12]
			});

			const marker = L.marker([venue.latitude, venue.longitude], {
				icon: venueIcon,
				title: venue.name
			}).addTo(map);

			// Add click handler
			marker.on('click', () => {
				veggieActions.selectVenue(venue);
			});

			// Add popup
			const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-bold text-lg mb-1">${venue.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${venue.address}</p>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 rounded-full" style="background-color: ${color}"></div>
            <span class="text-xs capitalize">${venue.vegetarian_type.replace('_', ' ')}</span>
            ${venue.verified ? '<span class="text-xs bg-blue-100 text-blue-800 px-1 rounded">Verified</span>' : ''}
          </div>
          <div class="flex items-center gap-1 mb-2">
            <div class="flex text-yellow-400">
              ${'★'.repeat(Math.floor(venue.rating))}${'☆'.repeat(5 - Math.floor(venue.rating))}
            </div>
            <span class="text-xs text-gray-500">(${venue.review_count || 0})</span>
          </div>
          <p class="text-xs text-gray-600 capitalize">${venue.cuisine_type || 'Various'}</p>
        </div>
      `;

			marker.bindPopup(popupContent);
			venueMarkers.push(marker);
		});
	}

	// Reactive updates
	$: if (map && $userLocation) {
		updateUserMarker($userLocation);
	}

	$: if (map && $filteredVenues) {
		updateVenueMarkers($filteredVenues);
	}

	$: if (map && $selectedVenue) {
		// Center map on selected venue
		map.setView([$selectedVenue.latitude, $selectedVenue.longitude], 16);

		// Update markers to show selection
		updateVenueMarkers($filteredVenues);
	}

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div
	class="relative w-full overflow-hidden rounded-lg shadow-lg"
	style="height: {height}; z-index: 1;"
>
	<div bind:this={mapContainer} class="h-full w-full" style="z-index: 1;">
		<!-- Loading overlay -->
		<div class="flex h-full items-center justify-center bg-gray-100">
			<div class="text-center">
				<div class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
				<p class="mt-2 text-gray-600">Loading map...</p>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.leaflet-container) {
		font-family: inherit;
		z-index: 1 !important;
	}

	:global(.leaflet-control-container) {
		z-index: 2 !important;
	}

	:global(.leaflet-popup) {
		z-index: 3 !important;
	}

	:global(.user-location-marker) {
		background: transparent !important;
		border: none !important;
	}

	:global(.venue-marker) {
		background: transparent !important;
		border: none !important;
	}

	:global(.leaflet-popup-content-wrapper) {
		border-radius: 8px;
	}

	:global(.leaflet-popup-content) {
		margin: 0;
		padding: 0;
	}

	:global(.leaflet-popup-close-button) {
		color: #6b7280 !important;
		font-size: 18px !important;
		padding: 4px 8px !important;
	}

	:global(.leaflet-popup-close-button:hover) {
		color: #374151 !important;
	}
</style>
