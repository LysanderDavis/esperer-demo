<!-- src/routes/members/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css'; // Don't forget this
	import Typography from '$lib/components/Typography.svelte';

	let map: L.Map;
	let mapContainer: HTMLDivElement;

	type LatLngTuple = [number, number];

	const members: { name: string; location: LatLngTuple; description: string }[] = [
		{ name: 'Kaarle Hurtig', location: [60.1699, 24.9384], description: 'Entrepreneur' },
		{ name: 'Alex Cruise', location: [49.2827, -123.1207], description: 'Big data nerd, nonprofit board member' },
		{ name: 'Julia van Boven', location: [52.3676, 4.9041], description: 'Co-founder and Community Director' },
		{ name: 'Emily Reschke', location: [51.9225, 4.4792], description: 'Rotterdam' }
	];

	onMount(() => {
		// Prevent initializing map multiple times
		if (!map) {
			map = L.map(mapContainer).setView([20, 0], 2);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap contributors'
			}).addTo(map);

			members.forEach((member) => {
				L.marker(member.location)
					.addTo(map)
					.bindPopup(`<strong>${member.name}</strong><br>${member.description}`);
			});
		}
	});
</script>

<div class="flex min-h-screen flex-col bg-[#9d5d2c] p-4">
	<div class="mb-4">
		<Typography variant="h1" className="text-white">Members Map</Typography>
	</div>

	<div class="flex-1 overflow-hidden rounded-xl shadow-lg">
		<div
			bind:this={mapContainer}
			class="w-full h-[80vh] rounded-xl shadow-md z-10"
		></div>
	</div>

	<!-- Optional bottom panel for members -->
	<div class="mt-4 flex gap-4 overflow-x-auto rounded-xl bg-white p-4">
		{#each members as member}
			<div class="min-w-[200px] rounded-xl bg-[#fefefe] p-4 shadow">
				<Typography variant="h3" className="text-[#9d5d2c]">{member.name}</Typography>
				<Typography variant="body">{member.description}</Typography>
			</div>
		{/each}
	</div>
</div>
