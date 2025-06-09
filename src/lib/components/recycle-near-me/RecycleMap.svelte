<!-- src/lib/components/recycle-near-me/RecycleMap.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let userLocation: { lat: number; lng: number };
	export let recyclingCenters: any[] = [];

	let mapContainer: HTMLDivElement;
	let map: any;
	let L: any;
	let userMarker: any;
	let recyclingMarkers: any[] = [];

	onMount(async () => {
		if (browser) {
			// Dynamically import Leaflet
			L = (await import('leaflet')).default;

			// Fix for default markers in Leaflet with bundlers
			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl:
					'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
			});

			initializeMap();
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});

	function initializeMap() {
		if (!L || !mapContainer) return;

		// Initialize map
		map = L.map(mapContainer).setView([userLocation.lat, userLocation.lng], 13);

		// Add tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		// Add user location marker
		const userIcon = L.divIcon({
			html: `<div class="user-location-marker">
				<div class="pulse"></div>
				<div class="dot"></div>
			</div>`,
			className: 'custom-user-marker',
			iconSize: [20, 20],
			iconAnchor: [10, 10]
		});

		userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
			.addTo(map)
			.bindPopup('<b>Your Location</b><br>You are here!');

		// Add search radius circle
		L.circle([userLocation.lat, userLocation.lng], {
			color: '#10b981',
			fillColor: '#10b981',
			fillOpacity: 0.1,
			radius: 5000
		}).addTo(map);

		// Add recycling center markers
		updateRecyclingMarkers();
	}

	function updateRecyclingMarkers() {
		if (!map || !L) return;

		// Clear existing markers
		recyclingMarkers.forEach((marker) => map.removeLayer(marker));
		recyclingMarkers = [];

		// Add new markers
		recyclingCenters.forEach((center, index) => {
			if (!center.lat || !center.lng) return;

			const recycleIcon = L.divIcon({
				html: `<div class="recycle-marker">♻️</div>`,
				className: 'custom-recycle-marker',
				iconSize: [30, 30],
				iconAnchor: [15, 15]
			});

			const marker = L.marker([center.lat, center.lng], { icon: recycleIcon })
				.addTo(map)
				.bindPopup(createPopupContent(center));

			recyclingMarkers.push(marker);
		});
	}

	function createPopupContent(center: any) {
		const materials =
			center.materials && center.materials.length > 0
				? center.materials.join(', ')
				: 'General recycling';

		return `
			<div class="popup-content">
				<h3 class="popup-title">${center.name}</h3>
				<div class="popup-info">
					<p><strong>Materials:</strong> ${materials}</p>
					${center.operator !== 'Unknown' ? `<p><strong>Operator:</strong> ${center.operator}</p>` : ''}
					${center.openingHours !== 'Not specified' ? `<p><strong>Hours:</strong> ${center.openingHours}</p>` : ''}
				</div>
				<button onclick="navigator.geolocation && navigator.geolocation.getCurrentPosition(pos => {
					window.open(\`https://www.google.com/maps/dir/\${pos.coords.latitude},\${pos.coords.longitude}/\${center.lat},\${center.lng}\`, '_blank')
				})" class="directions-btn">
					🧭 Get Directions
				</button>
			</div>
		`;
	}

	// React to changes in recycling centers
	$: if (map && recyclingCenters) {
		updateRecyclingMarkers();
	}
</script>

<div bind:this={mapContainer} class="relative z-10 h-full min-h-[400px] w-full"></div>

<style>
	/* Ensure map doesn't interfere with header */
	:global(.leaflet-container) {
		z-index: 10 !important;
	}

	:global(.leaflet-control-container) {
		z-index: 15 !important;
	}

	/* Ensure popups appear above map but below header */
	:global(.leaflet-popup-pane) {
		z-index: 40 !important;
	}

	/* ... rest of your existing styles ... */
	:global(.custom-user-marker) {
		background: transparent !important;
		border: none !important;
	}

	:global(.user-location-marker) {
		position: relative;
		width: 20px;
		height: 20px;
	}

	:global(.custom-user-marker) {
		background: transparent !important;
		border: none !important;
	}

	:global(.user-location-marker) {
		position: relative;
		width: 20px;
		height: 20px;
	}

	:global(.user-location-marker .pulse) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 20px;
		height: 20px;
		background: rgba(59, 130, 246, 0.3);
		border-radius: 50%;
		animation: pulse 2s infinite;
	}

	:global(.user-location-marker .dot) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 8px;
		height: 8px;
		background: #3b82f6;
		border: 2px solid white;
		border-radius: 50%;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	:global(.custom-recycle-marker) {
		background: transparent !important;
		border: none !important;
	}

	:global(.recycle-marker) {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		background: white;
		border: 2px solid #10b981;
		border-radius: 50%;
		font-size: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;
	}

	:global(.recycle-marker:hover) {
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	:global(.popup-content) {
		font-family: 'Inter', sans-serif;
		min-width: 200px;
	}

	:global(.popup-title) {
		font-size: 16px;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 8px 0;
		padding-bottom: 8px;
		border-bottom: 1px solid #e5e7eb;
	}

	:global(.popup-info) {
		margin-bottom: 12px;
	}

	:global(.popup-info p) {
		margin: 4px 0;
		font-size: 14px;
		color: #4b5563;
	}

	:global(.directions-btn) {
		background: #10b981;
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
		width: 100%;
	}

	:global(.directions-btn:hover) {
		background: #059669;
	}

	@keyframes pulse {
		0% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) scale(2);
			opacity: 0;
		}
	}
</style>
