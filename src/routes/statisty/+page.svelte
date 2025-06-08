<!-- src/routes/statisty/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import BMICalculator from '$lib/components/statisty/BMICalculator.svelte';
	import AirQualityIndicator from '$lib/components/statisty/AirQualityIndicator.svelte';
	import CarbonEstimator from '$lib/components/statisty/CarbonEstimator.svelte';
	import SleepTracker from '$lib/components/statisty/SleepTracker.svelte';
	import HydrationTracker from '$lib/components/statisty/HydrationTracker.svelte';
	import NutritionAdvisor from '$lib/components/statisty/NutritionAdvisor.svelte';
	import MetricCard from '$lib/components/statisty/MetricCard.svelte';

	let user: any = null;
	let loading = true;

	onMount(async () => {
		// Get current user
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();
		user = currentUser;
		loading = false;
	});
</script>

<svelte:head>
	<title>Statisty - Personal Health Dashboard</title>
	<meta
		name="description"
		content="Track your health metrics with Statisty - BMI, sleep, nutrition, air quality, and more."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-800">📊 Statisty Dashboard</h1>
			<p class="mx-auto max-w-2xl text-xl text-gray-600">
				Your personal health metrics hub. Track, analyze, and improve your wellness journey.
			</p>
		</div>

		{#if loading}
			<div class="flex min-h-64 items-center justify-center">
				<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
			</div>
		{:else if !user}
			<div class="py-12 text-center">
				<div class="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
					<h2 class="mb-4 text-2xl font-semibold text-gray-800">Welcome to Statisty</h2>
					<p class="mb-6 text-gray-600">Please log in to access your personal health dashboard.</p>
					<a
						href="/login"
						class="inline-block rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
					>
						Log In
					</a>
				</div>
			</div>
		{:else}
			<!-- Dashboard Grid -->
			<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
				<!-- Quick Stats Overview -->
				<div class="xl:col-span-3">
					<div class="rounded-xl bg-white p-6 shadow-lg">
						<h2 class="mb-4 text-2xl font-semibold text-gray-800">📈 Quick Overview</h2>
						<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
							<MetricCard title="BMI Status" value="Normal" icon="⚖️" color="green" />
							<MetricCard title="Sleep Score" value="85%" icon="😴" color="blue" />
							<MetricCard title="Air Quality" value="Good" icon="🌬️" color="green" />
							<MetricCard title="Hydration" value="1.8L" icon="💧" color="blue" />
						</div>
					</div>
				</div>

				<!-- BMI Calculator -->
				<div class="lg:col-span-1">
					<BMICalculator />
				</div>

				<!-- Air Quality -->
				<div class="lg:col-span-1">
					<AirQualityIndicator />
				</div>

				<!-- Sleep Tracker -->
				<div class="lg:col-span-1">
					<SleepTracker />
				</div>

				<!-- Hydration Tracker -->
				<div class="lg:col-span-1">
					<HydrationTracker />
				</div>

				<!-- Carbon Footprint -->
				<div class="lg:col-span-1">
					<CarbonEstimator />
				</div>

				<!-- Nutrition Advisor -->
				<div class="lg:col-span-1">
					<NutritionAdvisor />
				</div>
			</div>

			<!-- Additional Tools Section -->
			<div class="rounded-xl bg-white p-6 shadow-lg">
				<h2 class="mb-6 text-2xl font-semibold text-gray-800">🛠️ Health Tools</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					<div
						class="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300"
					>
						<h3 class="mb-2 font-semibold text-gray-800">📋 Health Reports</h3>
						<p class="mb-3 text-sm text-gray-600">Generate comprehensive health reports</p>
						<button class="text-sm font-medium text-blue-500 hover:text-blue-600">
							Coming Soon
						</button>
					</div>

					<div
						class="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300"
					>
						<h3 class="mb-2 font-semibold text-gray-800">🎯 Goal Setting</h3>
						<p class="mb-3 text-sm text-gray-600">Set and track your health goals</p>
						<button class="text-sm font-medium text-blue-500 hover:text-blue-600">
							Coming Soon
						</button>
					</div>

					<div
						class="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300"
					>
						<h3 class="mb-2 font-semibold text-gray-800">📊 Analytics</h3>
						<p class="mb-3 text-sm text-gray-600">Deep dive into your health trends</p>
						<button class="text-sm font-medium text-blue-500 hover:text-blue-600">
							Coming Soon
						</button>
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
	}
</style>
