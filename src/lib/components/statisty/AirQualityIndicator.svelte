<!-- src/lib/components/statisty/AirQualityIndicator.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';

	interface AirQualityData {
		aqi: number;
		category: string;
		color: string;
		healthAdvice: string;
		location: string;
		timestamp: Date;
		dominentpol?: string;
		city?: string;
		attribution?: string;
	}

	let airQuality: AirQualityData | null = null;
	let loading = true;
	let error = '';
	let user: any = null;

	// API configuration - you'll need to get a free API token from https://aqicn.org/data-platform/token/
	const API_TOKEN = '1d4c5bb7bb24aa07dd22d485be712a8962f65fba'; // Replace with your actual API token
	const WAQI_BASE_URL = 'https://api.waqi.info';

	function getAQICategory(aqi: number): string {
		if (aqi <= 50) return 'Good';
		if (aqi <= 100) return 'Moderate';
		if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
		if (aqi <= 200) return 'Unhealthy';
		if (aqi <= 300) return 'Very Unhealthy';
		return 'Hazardous';
	}

	function getAQIColor(aqi: number): string {
		if (aqi <= 50) return 'bg-green-500';
		if (aqi <= 100) return 'bg-yellow-500';
		if (aqi <= 150) return 'bg-orange-500';
		if (aqi <= 200) return 'bg-red-500';
		if (aqi <= 300) return 'bg-purple-500';
		return 'bg-red-800';
	}

	function getHealthAdvice(aqi: number): string {
		if (aqi <= 50) return 'Air quality is good. Perfect for outdoor activities!';
		if (aqi <= 100)
			return 'Air quality is acceptable. Sensitive individuals should limit outdoor activities.';
		if (aqi <= 150) return 'Sensitive groups should reduce outdoor activities.';
		if (aqi <= 200) return 'Everyone should limit outdoor activities.';
		if (aqi <= 300) return 'Avoid outdoor activities. Health warnings in effect.';
		return 'Emergency conditions. Avoid all outdoor activities.';
	}

	async function fetchAirQualityByCoords(lat: number, lng: number): Promise<AirQualityData | null> {
		try {
			const response = await fetch(
				`${WAQI_BASE_URL}/feed/geo:${lat};${lng}/?token=${API_TOKEN}`
			);
			const data = await response.json();

			if (data.status === 'ok' && data.data) {
				const aqiData = data.data;
				const aqi = aqiData.aqi;
				
				return {
					aqi: aqi,
					category: getAQICategory(aqi),
					color: getAQIColor(aqi),
					healthAdvice: getHealthAdvice(aqi),
					location: aqiData.city?.name || `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
					timestamp: new Date(),
					dominentpol: aqiData.dominentpol,
					city: aqiData.city?.name,
					attribution: aqiData.attributions?.[0]?.name
				};
			}
			return null;
		} catch (err) {
			console.error('Error fetching air quality data:', err);
			return null;
		}
	}

	async function fetchAirQualityByCity(city: string): Promise<AirQualityData | null> {
		try {
			const response = await fetch(`${WAQI_BASE_URL}/feed/${city}/?token=${API_TOKEN}`);
			const data = await response.json();

			if (data.status === 'ok' && data.data) {
				const aqiData = data.data;
				const aqi = aqiData.aqi;
				
				return {
					aqi: aqi,
					category: getAQICategory(aqi),
					color: getAQIColor(aqi),
					healthAdvice: getHealthAdvice(aqi),
					location: aqiData.city?.name || city,
					timestamp: new Date(),
					dominentpol: aqiData.dominentpol,
					city: aqiData.city?.name,
					attribution: aqiData.attributions?.[0]?.name
				};
			}
			return null;
		} catch (err) {
			console.error('Error fetching air quality data:', err);
			return null;
		}
	}

	async function fetchAirQuality() {
		try {
			loading = true;
			error = '';

			// Try to get user's location first
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						const { latitude, longitude } = position.coords;
						
						const data = await fetchAirQualityByCoords(latitude, longitude);
						if (data) {
							airQuality = data;
							
							// Save to database if user is logged in
							if (user) {
								await supabase.from('statisty_metrics').insert({
									user_id: user.id,
									metric: 'air_quality',
									data: airQuality
								});
							}
						} else {
							error = 'Unable to fetch air quality data for your location';
						}
						loading = false;
					},
					async (err) => {
						console.log('Geolocation error:', err);
						// Fallback to Tashkent (user's location from context)
						const data = await fetchAirQualityByCity('tashkent');
						if (data) {
							airQuality = data;
						} else {
							error = 'Unable to fetch air quality data';
						}
						loading = false;
					},
					{
						timeout: 10000,
						enableHighAccuracy: false
					}
				);
			} else {
				// Fallback to Tashkent
				const data = await fetchAirQualityByCity('tashkent');
				if (data) {
					airQuality = data;
				} else {
					error = 'Geolocation not supported and unable to fetch default data';
				}
				loading = false;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch air quality data';
			loading = false;
		}
	}

	onMount(async () => {
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();
		user = currentUser;

		// Check if we have recent air quality data
		if (user) {
			const { data } = await supabase
				.from('statisty_metrics')
				.select('data, created_at')
				.eq('user_id', user.id)
				.eq('metric', 'air_quality')
				.order('created_at', { ascending: false })
				.limit(1);

			if (data && data.length > 0) {
				const lastCheck = new Date(data[0].created_at);
				const now = new Date();
				const hoursSinceLastCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);

				// Use cached data if less than 1 hour old
				if (hoursSinceLastCheck < 1) {
					airQuality = data[0].data;
					loading = false;
					return;
				}
			}
		}

		await fetchAirQuality();
	});
</script>

<div class="h-full rounded-xl bg-white p-6 shadow-lg border border-gray-100">
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center">
			<span class="mr-2 text-2xl">🌬️</span>
			<h3 class="text-xl font-semibold text-gray-800">Air Quality</h3>
		</div>
		<button
			on:click={fetchAirQuality}
			disabled={loading}
			class="text-sm text-[#b27a56] hover:text-[#7d4a22] disabled:text-gray-400 transition-colors duration-200"
		>
			{#if loading}
				<span class="inline-block animate-spin">🔄</span>
			{:else}
				↻
			{/if}
			Refresh
		</button>
	</div>

	{#if loading}
		<div class="animate-pulse space-y-4">
			<div class="flex h-20 items-center justify-center">
				<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-[#9d5d2c]"></div>
			</div>
			<div class="h-4 w-3/4 rounded bg-gray-200"></div>
			<div class="h-4 w-1/2 rounded bg-gray-200"></div>
		</div>
	{:else if error}
		<div class="py-8 text-center">
			<div class="mb-4 text-sm text-red-500">❌ {error}</div>
			<div class="mb-4 text-xs text-gray-500">
				Note: To get real-time data, you need to:
				<br />1. Get a free API token from <a href="https://aqicn.org/data-platform/token/" target="_blank" class="text-[#9d5d2c] underline">aqicn.org</a>
				<br />2. Replace the demo token in the code
			</div>
			<button
				on:click={fetchAirQuality}
				class="rounded-lg bg-[#9d5d2c] px-4 py-2 text-sm text-white hover:bg-[#7d4a22] transition-colors duration-200"
			>
				Try Again
			</button>
		</div>
	{:else if airQuality}
		<div class="space-y-4">
			<!-- AQI Display -->
			<div class="text-center">
				<div class="mb-2 text-4xl font-bold text-gray-800">
					{airQuality.aqi}
				</div>
				<div
					class="inline-block rounded-full px-4 py-2 text-sm font-medium text-white {airQuality.color}"
				>
					{airQuality.category}
				</div>
				{#if airQuality.dominentpol}
					<div class="mt-2 text-xs text-gray-500">
						Dominant pollutant: {airQuality.dominentpol.toUpperCase()}
					</div>
				{/if}
			</div>

			<!-- Health Advice -->
			<div class="rounded-lg bg-gradient-to-r from-[#9d5d2c]/5 to-[#9d5d2c]/10 p-4 border border-[#9d5d2c]/20">
				<h4 class="mb-2 font-medium text-[#9d5d2c]">Health Advice:</h4>
				<p class="text-sm text-gray-600">{airQuality.healthAdvice}</p>
			</div>

			<!-- Location and Time -->
			<div class="space-y-1 text-xs text-gray-500">
				<div class="flex items-center">
					<span class="mr-1">📍</span>
					<span>{airQuality.location}</span>
				</div>
				<div class="flex items-center">
					<span class="mr-1">🕒</span>
					<span>Updated: {airQuality.timestamp.toLocaleTimeString()}</span>
				</div>
				{#if airQuality.attribution}
					<div class="flex items-center">
						<span class="mr-1">ℹ️</span>
						<span>Source: {airQuality.attribution}</span>
					</div>
				{/if}
			</div>

			<!-- AQI Scale Reference -->
			<div class="space-y-1 text-xs">
				<div class="mb-2 font-medium text-[#9d5d2c]">AQI Scale:</div>
				<div class="grid grid-cols-2 gap-1">
					<div class="flex items-center">
						<div class="mr-2 h-3 w-3 rounded bg-green-500"></div>
						<span>Good (0-50)</span>
					</div>
					<div class="flex items-center">
						<div class="mr-2 h-3 w-3 rounded bg-yellow-500"></div>
						<span>Moderate (51-100)</span>
					</div>
					<div class="flex items-center">
						<div class="mr-2 h-3 w-3 rounded bg-orange-500"></div>
						<span>Unhealthy for Sensitive (101-150)</span>
					</div>
					<div class="flex items-center">
						<div class="mr-2 h-3 w-3 rounded bg-red-500"></div>
						<span>Unhealthy (151-200)</span>
					</div>
					<div class="flex items-center">
						<div class="mr-2 h-3 w-3 rounded bg-purple-500"></div>
						<span>Very Unhealthy (201-300)</span>
					</div>
					<div class="flex items-center">
						<div class="mr-2 h-3 w-3 rounded bg-red-800"></div>
						<span>Hazardous (300+)</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>