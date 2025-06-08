<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import type { User } from '@supabase/supabase-js';

	import BMICalculator from '$lib/components/statisty/BMICalculator.svelte';
	import AirQualityIndicator from '$lib/components/statisty/AirQualityIndicator.svelte';
	import CarbonEstimator from '$lib/components/statisty/CarbonEstimator.svelte';
	import SleepTracker from '$lib/components/statisty/SleepTracker.svelte';
	import HydrationTracker from '$lib/components/statisty/HydrationTracker.svelte';
	import NutritionAdvisor from '$lib/components/statisty/NutritionAdvisor.svelte';
	import MetricCard from '$lib/components/statisty/MetricCard.svelte';
	import Typography from '$lib/components/Typography.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let user: User | null = null;
	let loading = true;

	onMount(async () => {
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();
		user = currentUser;
		loading = false;
	});
</script>

<svelte:head>
	<title>Statisty – Personal Health Dashboard</title>
	<meta
		name="description"
		content="Track your health metrics with Statisty – BMI, sleep, nutrition, air quality, and more."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-32 pb-16">
	<div class="mx-auto max-w-6xl px-6">
		<!-- Header -->
		<div class="mb-16 text-center">
			<Typography variant="h1" className="text-[#9d5d2c] mb-6 text-4xl md:text-5xl">
				Statisty Dashboard
			</Typography>
			<Typography variant="body" className="text-[#9d5d2c]/80 max-w-2xl mx-auto">
				Your personal health metrics hub. Track, analyze, and improve your wellness journey.
			</Typography>
		</div>

		{#if loading}
			<div class="flex min-h-64 items-center justify-center">
				<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-[#b06b35]"></div>
			</div>
		{:else if !user}
			<div class="py-12 text-center">
				<div class="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
					<h2 class="mb-4 text-2xl font-semibold text-gray-800">Welcome to Statisty</h2>
					<p class="mb-6 text-gray-600">Please log in to access your personal health dashboard.</p>
					<a
						href="/login"
						class="inline-block rounded-lg bg-[#b06b35] px-6 py-3 font-medium text-white transition-colors hover:bg-[#9d5d2c]"
					>
						Log In
					</a>
				</div>
			</div>
		{:else}
			<!-- Dashboard Grid -->
			<div class="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
				<div class="xl:col-span-3">
					<div class="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
						<h2 class="mb-4 text-2xl font-semibold text-[#9d5d2c]">📈 Quick Overview</h2>
						<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
							<MetricCard title="BMI Status" value="Normal" icon="⚖️" color="green" />
							<MetricCard title="Sleep Score" value="85%" icon="😴" color="blue" />
							<MetricCard title="Air Quality" value="Good" icon="🌬️" color="green" />
							<MetricCard title="Hydration" value="1.8L" icon="💧" color="blue" />
						</div>
					</div>
				</div>

				<!-- Individual Metric Cards -->
				<div class="lg:col-span-1" transition:fly={{ y: 20, duration: 500, easing: quintOut }}>
					<BMICalculator />
				</div>
				<div class="lg:col-span-1" transition:fly={{ y: 20, duration: 600, easing: quintOut }}>
					<AirQualityIndicator />
				</div>
				<div class="lg:col-span-1" transition:fly={{ y: 20, duration: 700, easing: quintOut }}>
					<SleepTracker />
				</div>
				<div class="lg:col-span-1" transition:fly={{ y: 20, duration: 800, easing: quintOut }}>
					<HydrationTracker />
				</div>
				<div class="lg:col-span-1" transition:fly={{ y: 20, duration: 900, easing: quintOut }}>
					<CarbonEstimator />
				</div>
				<div class="lg:col-span-1" transition:fly={{ y: 20, duration: 1000, easing: quintOut }}>
					<NutritionAdvisor />
				</div>
			</div>

			<!-- Additional Tools -->
			<div class="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
				<h2 class="mb-6 text-2xl font-semibold text-[#9d5d2c]">🛠️ Health Tools</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each [{ title: '📋 Health Reports', desc: 'Generate comprehensive health reports' }, { title: '🎯 Goal Setting', desc: 'Set and track your health goals' }, { title: '📊 Analytics', desc: 'Deep dive into your health trends' }] as tool}
						<div
							class="rounded-lg border border-[#b06b35]/20 bg-white p-4 transition-all hover:border-[#b06b35]/50 hover:bg-[#b06b35]/5"
						>
							<h3 class="mb-2 font-semibold text-[#9d5d2c]">{tool.title}</h3>
							<p class="mb-3 text-sm text-gray-600">{tool.desc}</p>
							<button class="text-sm font-medium text-[#b06b35] hover:text-[#9d5d2c]"
								>Coming Soon</button
							>
						</div>
					{/each}
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
