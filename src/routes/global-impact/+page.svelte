<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import Typography from '$lib/components/Typography.svelte';

	let map: L.Map;
	let mapContainer: HTMLDivElement;

	type LatLngTuple = [number, number];

	const members: { name: string; location: LatLngTuple; description: string }[] = [
		{ name: 'Kaarle Hurtig', location: [60.1699, 24.9384], description: 'Entrepreneur' },
		{
			name: 'Alex Cruise',
			location: [49.2827, -123.1207],
			description: 'Big data nerd, nonprofit board member'
		},
		{
			name: 'Julia van Boven',
			location: [52.3676, 4.9041],
			description: 'Co-founder and Community Director'
		},
		{ name: 'Emily Reschke', location: [51.9225, 4.4792], description: 'Rotterdam' }
	];

	const markerIcon = L.divIcon({
		className: 'custom-marker',
		html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9d5d2c" width="32" height="32">
		<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
	</svg>`,
		iconSize: [32, 32],
		iconAnchor: [16, 32], // anchor at bottom of icon
		popupAnchor: [0, -32]
	});

	onMount(() => {
		if (!map) {
			map = L.map(mapContainer).setView([20, 0], 2);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap contributors'
			}).addTo(map);

			members.forEach((member) => {
				L.marker(member.location, { icon: markerIcon })
					.addTo(map)
					.bindPopup(`<strong>${member.name}</strong><br>${member.description}`);
			});
		}
	});
</script>

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
				<Typography variant="body">{member.description}</Typography>
			</div>
		{/each}
	</div>
</div>
