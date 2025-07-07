<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import Typography from '$lib/components/Typography.svelte';

	let map: L.Map | null = null;
	let mapContainer: HTMLDivElement;
	let markers: L.Marker[] = [];

	type LatLngTuple = [number, number];

	interface Member {
		name: string;
		location: LatLngTuple;
		description: string;
		city: string;
		country: string;
	}

	const members: Member[] = [
		{
			name: 'Shohjahon Isroilov',
			location: [41.3, 69.3401],
			description: 'Volunteer',
			city: 'Tashkent',
			country: 'Uzbekistan'
		},
		{
			name: 'Sevara Kodirova',
			location: [41.34, 69.3401],
			description: 'Volunteer',
			city: 'Tashkent',
			country: 'Uzbekistan'
		},
		{
			name: 'Samariddin Gaziyev',
			location: [41.2995, 69.2401],
			description: 'Volunteer',
			city: 'Tashkent',
			country: 'Uzbekistan'
		},
		{
			name: 'Muhammadlaziz Ibaydullayev',
			location: [40.62177, 72.45236],
			description: 'Founder',
			city: 'Andijan',
			country: 'Uzbekistan'
		},
		{
			name: 'Anna Novikova',
			location: [42.2965, -71.2924],
			description: 'Member',
			city: 'Wellesley, Massachusetts',
			country: 'USA'
		},
		{
			name: 'Nahom Ayana',
			location: [10.06499, 34.54587],
			description: 'Member',
			city: 'Asosa',
			country: 'Ethiopia'
		},
		{
			name: 'Tafsir Sikder',
			location: [23.7302, 90.3911], // Fixed coordinates for Dhaka
			description: 'Member',
			city: 'Dhaka',
			country: 'Bangladesh'
		},
		{
			name: 'Shreya Lal',
			location: [-18.13638, 178.43403], // Fixed coordinates for Suva
			description: 'Member',
			city: 'Suva',
			country: 'Fiji'
		},
		{
			name: 'Kiranjot Kour',
			location: [17.42155, 78.43445],
			description: 'Member',
			city: 'Hyderabad',
			country: 'India'
		}
	];

	const createMarkerIcon = () => {
		return L.divIcon({
			className: 'custom-marker',
			html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9d5d2c" width="32" height="32">
				<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
			</svg>`,
			iconSize: [32, 32],
			iconAnchor: [16, 32],
			popupAnchor: [0, -32]
		});
	};

	const createPopupContent = (member: Member): string => {
		return `
			<div class="popup-content" style="min-width: 200px; padding: 8px;">
				<h3 style="margin: 0 0 8px 0; font-weight: bold; color: #9d5d2c; font-size: 16px;">
					${member.name}
				</h3>
				<p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">
					<strong>Role:</strong> ${member.description}
				</p>
				<p style="margin: 0; font-size: 14px; color: #666;">
					<strong>Location:</strong> ${member.city}, ${member.country}
				</p>
			</div>
		`;
	};

	const initializeMap = () => {
		if (!mapContainer || map) return;

		try {
			map = L.map(mapContainer, {
				center: [20, 0],
				zoom: 2,
				zoomControl: true,
				scrollWheelZoom: true,
				doubleClickZoom: true,
				touchZoom: true
			});

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				maxZoom: 18
			}).addTo(map);

			// Add markers
			members.forEach((member) => {
				const marker = L.marker(member.location, {
					icon: createMarkerIcon(),
					title: `${member.name} - ${member.city}, ${member.country}` // Tooltip on hover
				})
					.addTo(map!)
					.bindPopup(createPopupContent(member), {
						maxWidth: 300,
						className: 'custom-popup'
					});

				// Add click event for mobile compatibility
				marker.on('click', () => {
					marker.openPopup();
				});

				markers.push(marker);
			});

			// Fit map to show all markers
			if (markers.length > 0) {
				const group = L.featureGroup(markers);
				map.fitBounds(group.getBounds().pad(0.1));
			}
		} catch (error) {
			console.error('Error initializing map:', error);
		}
	};

	const cleanupMap = () => {
		if (map) {
			markers.forEach((marker) => marker.remove());
			markers = [];
			map.remove();
			map = null;
		}
	};

	onMount(() => {
		// Wait for DOM to be ready
		setTimeout(() => {
			initializeMap();
		}, 100);
	});

	onDestroy(() => {
		cleanupMap();
	});
</script>

<svelte:head>
	<title>Global Impact | Mapping a Sustainable Future</title>
	<meta
		name="description"
		content="The Map of Global Impact: Discover the members of Espérer and their contributions to a sustainable future."
	/>
</svelte:head>

<!-- Main Layout -->
<div class="flex min-h-screen flex-col bg-[#f5e9dc] pt-40 pb-4">
	<!-- Content (title + map) -->
	<div class="container mx-auto px-4">
		<!-- Title -->
		<div class="mb-4">
			<Typography
				variant="h1"
				className="text-[#9d5d2c] text-center text-5xl md:text-4xl font-bold"
			>
				Members Map
			</Typography>
		</div>

		<!-- Map -->
		<div class="flex-1 overflow-hidden rounded-xl shadow-lg">
			<div bind:this={mapContainer} class="z-10 h-[80vh] w-full rounded-xl shadow-md"></div>
		</div>
	</div>

	<!-- Full-width scrollable bottom section -->
	<div class="mt-4 flex gap-4 overflow-x-auto rounded-xl bg-white p-4 px-8">
		{#each members as member}
			<div class="min-w-[200px] rounded-xl bg-[#fefefe] p-4 shadow">
				<Typography variant="h3" className="text-[#9d5d2c]">{member.name}</Typography>
				<Typography variant="body"
					>{member.description} ({member.city}, {member.country})</Typography
				>
			</div>
		{/each}
	</div>
</div>

<style>
	:global(.custom-marker) {
		background: transparent !important;
		border: none !important;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	:global(.custom-marker:hover) {
		transform: scale(1.1);
	}

	:global(.custom-popup .leaflet-popup-content-wrapper) {
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	:global(.custom-popup .leaflet-popup-tip) {
		background: white;
	}

	:global(.leaflet-container) {
		font-family: inherit;
	}
</style>
