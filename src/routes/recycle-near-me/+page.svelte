<!-- src/routes/incentives/recycle-near-me/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { supabase } from '$lib/supabaseClient.js';
	import type { User } from '@supabase/supabase-js';
	import RecycleMap from '$lib/components/recycle-near-me/RecycleMap.svelte';
	import LocationPermissionCard from '$lib/components/recycle-near-me/LocationPermissionCard.svelte';
	import SubmissionForm from '$lib/components/recycle-near-me/SubmissionForm.svelte';
	import Typography from '$lib/components/Typography.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let user: User | null = null;
	let loading = true;
	let userLocation: { lat: number; lng: number } | null = null;
	let locationPermissionGranted = false;
	let locationError = '';
	let recyclingCenters: any[] = [];
	let showSubmissionForm = false;

	onMount(async () => {
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();
		user = currentUser;
		loading = false;

		// Check if geolocation is available
		if (browser && navigator.geolocation) {
			requestLocation();
		}
	});

	async function requestLocation() {
		try {
			const position = await new Promise<GeolocationPosition>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, {
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 300000 // 5 minutes
				});
			});

			userLocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			locationPermissionGranted = true;
			await loadNearbyRecyclingCenters();
		} catch (error) {
			console.error('Location error:', error);
			locationError = 'Unable to access your location. Please enable location services.';
		}
	}

	async function loadNearbyRecyclingCenters() {
		if (!userLocation) return;

		try {
			const query = `
				[out:json][timeout:25];
				(
					node["amenity"="recycling"](around:5000,${userLocation.lat},${userLocation.lng});
					way["amenity"="recycling"](around:5000,${userLocation.lat},${userLocation.lng});
					relation["amenity"="recycling"](around:5000,${userLocation.lat},${userLocation.lng});
				);
				out center meta;
			`;

			const response = await fetch('https://overpass-api.de/api/interpreter', {
				method: 'POST',
				body: query,
				headers: {
					'Content-Type': 'text/plain'
				}
			});

			const data = await response.json();
			recyclingCenters = data.elements.map((element: any) => ({
				id: element.id,
				lat: element.lat || element.center?.lat,
				lng: element.lon || element.center?.lon,
				name: element.tags?.name || 'Recycling Center',
				recyclingType: element.tags?.recycling_type || 'General',
				operator: element.tags?.operator || 'Unknown',
				openingHours: element.tags?.opening_hours || 'Not specified',
				materials: Object.keys(element.tags || {})
					.filter((key) => key.startsWith('recycling:') && element.tags[key] === 'yes')
					.map((key) => key.replace('recycling:', ''))
			}));
		} catch (error) {
			console.error('Error loading recycling centers:', error);
		}
	}

	function handleLocationGranted() {
		requestLocation();
	}

	function toggleSubmissionForm() {
		showSubmissionForm = !showSubmissionForm;
	}

	async function handleSubmission(event: CustomEvent) {
		const { name, address, materials, notes } = event.detail;

		try {
			// First, geocode the address
			const geocodeResponse = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
			);
			const geocodeData = await geocodeResponse.json();

			if (geocodeData.length === 0) {
				throw new Error('Address not found');
			}

			const location = geocodeData[0];

			// Save to Supabase
			const { error } = await supabase.from('recycling_submissions').insert({
				name,
				address,
				lat: parseFloat(location.lat),
				lng: parseFloat(location.lon),
				materials,
				notes,
				submitted_by: user?.id,
				status: 'pending'
			});

			if (error) throw error;

			alert('Thank you for your submission! It will be reviewed before being added to the map.');
			showSubmissionForm = false;
		} catch (error) {
			console.error('Submission error:', error);
			alert('Failed to submit recycling center. Please try again.');
		}
	}
</script>

<svelte:head>
	<title>RecycleNearMe – Find Recycling Centers</title>
	<meta
		name="description"
		content="Find recycling centers near you with our interactive map. Contribute to environmental sustainability by recycling responsibly."
	/>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-green-50 to-white pt-32 pb-16">
	<div class="mx-auto max-w-7xl px-6">
		<!-- Header -->
		<div class="mb-12 text-center">
			<Typography variant="h1" className="text-green-700 mb-6 text-4xl md:text-5xl">
				♻️ RecycleNearMe
			</Typography>
			<Typography variant="body" className="text-green-600/80 max-w-2xl mx-auto">
				Find recycling centers near you and contribute to a sustainable future. Help your community
				by discovering and sharing recycling locations.
			</Typography>
		</div>

		{#if loading}
			<div class="flex min-h-64 items-center justify-center">
				<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
			</div>
		{:else if !user}
			<div class="py-12 text-center">
				<div class="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
					<h2 class="mb-4 text-2xl font-semibold text-gray-800">Welcome to RecycleNearMe</h2>
					<p class="mb-6 text-gray-600">
						Please log in to access the recycling center finder and contribute to our community
						database.
					</p>
					<a
						href="/login"
						class="inline-block rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
					>
						Log In
					</a>
				</div>
			</div>
		{:else}
			<!-- Main Content -->
			<div class="space-y-8">
				<!-- Location Permission Card -->
				{#if !locationPermissionGranted}
					<div transition:fly={{ y: 20, duration: 500, easing: quintOut }}>
						<LocationPermissionCard {locationError} on:grant={handleLocationGranted} />
					</div>
				{/if}

				<!-- Stats Overview -->
				{#if locationPermissionGranted}
					<div
						class="grid grid-cols-1 gap-6 md:grid-cols-3"
						transition:fly={{ y: 20, duration: 600, easing: quintOut }}
					>
						<div class="rounded-xl bg-white p-6 shadow-md">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm font-medium text-gray-600">Centers Found</p>
									<p class="text-2xl font-bold text-green-600">{recyclingCenters.length}</p>
								</div>
								<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
									<span class="text-2xl">🏢</span>
								</div>
							</div>
						</div>

						<div class="rounded-xl bg-white p-6 shadow-md">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm font-medium text-gray-600">Search Radius</p>
									<p class="text-2xl font-bold text-green-600">5km</p>
								</div>
								<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
									<span class="text-2xl">📍</span>
								</div>
							</div>
						</div>

						<div class="rounded-xl bg-white p-6 shadow-md">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm font-medium text-gray-600">Your Impact</p>
									<p class="text-2xl font-bold text-green-600">+♻️</p>
								</div>
								<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
									<span class="text-2xl">🌱</span>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Map Container -->
				{#if locationPermissionGranted && userLocation}
					<div
						class="overflow-hidden rounded-xl bg-white shadow-lg"
						transition:fly={{ y: 20, duration: 700, easing: quintOut }}
					>
						<div class="border-b border-gray-200 p-6">
							<div class="flex items-center justify-between">
								<h2 class="text-2xl font-semibold text-gray-800">🗺️ Interactive Map</h2>
								<button
									on:click={toggleSubmissionForm}
									class="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
								>
									+ Add Location
								</button>
							</div>
						</div>
						<div class="h-96 md:h-[500px]">
							<RecycleMap {userLocation} {recyclingCenters} />
						</div>
					</div>
				{/if}

				<!-- Submission Form -->
				{#if showSubmissionForm}
					<div transition:fly={{ y: 20, duration: 500, easing: quintOut }}>
						<SubmissionForm on:submit={handleSubmission} on:cancel={toggleSubmissionForm} />
					</div>
				{/if}

				<!-- Tips Section -->
				<div
					class="rounded-xl bg-white p-6 shadow-md"
					transition:fly={{ y: 20, duration: 800, easing: quintOut }}
				>
					<h2 class="mb-6 text-2xl font-semibold text-gray-800">💡 Recycling Tips</h2>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{#each [{ icon: '🗑️', title: 'Sort Properly', desc: 'Separate materials according to local guidelines' }, { icon: '🧽', title: 'Clean Containers', desc: 'Rinse food containers before recycling' }, { icon: '🔍', title: 'Check Symbols', desc: 'Look for recycling symbols and numbers' }, { icon: '📱', title: 'Electronics', desc: 'Take electronics to specialized centers' }, { icon: '🔋', title: 'Batteries', desc: 'Never put batteries in regular recycling' }, { icon: '🌍', title: 'Reduce First', desc: 'Remember: Reduce, Reuse, then Recycle' }] as tip}
							<div class="flex items-start space-x-3 rounded-lg bg-green-50 p-4">
								<span class="text-2xl">{tip.icon}</span>
								<div>
									<h3 class="font-semibold text-gray-800">{tip.title}</h3>
									<p class="text-sm text-gray-600">{tip.desc}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;
		scroll-behavior: smooth;
	}
</style>
