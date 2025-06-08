<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { supabase } from '$lib/supabaseClient.js';
	import type { Session } from '@supabase/supabase-js';

	let projects = [
		{
			id: 1,
			title: 'Statisty',
			description:
				'Track your personal metrics—BMI, hydration, carbon footprint, and more. Build healthier habits with comprehensive insights.',
			image: '/statisty-banner.png',
			cta: 'Learn More',
			link: '/statisty',
			category: 'Wellness & Sustainability'
		},
		{
			id: 2,
			title: 'Coming Soon...',
			description:
				'Be Hyped!',
			cta: 'Explore',
			link: '/eco-track',
			category: 'Environmental'
		}
	];

	let userSession: Session | null = null;
	let mounted = false;

	onMount(async () => {
		const { data, error } = await supabase.auth.getSession();
		if (!error && data?.session) {
			userSession = data.session;
		}
		mounted = true;
	});
</script>

<svelte:head>
	<title>Incentives | Espérer</title>
</svelte:head>

<!-- Hero Section -->
<section
	class="relative overflow-hidden bg-gradient-to-br from-[#f8f4f0] via-white to-[#f5ede4] pt-32 pb-12"
>
	<div
		class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5ZDVkMmMiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-40"
	></div>

	<div class="relative mx-auto max-w-7xl px-6 text-center sm:px-12 lg:px-24">
		{#if mounted}
			<div in:fade={{ duration: 800, delay: 200 }}>
				<h1 class="mb-6 text-4xl font-bold text-[#9d5d2c] sm:text-5xl lg:text-6xl">
					Our Incentives
				</h1>
				<p class="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700 sm:text-xl">
					Discover meaningful projects designed to create positive change. Each initiative empowers
					you to make a difference while building better habits for yourself and our world.
				</p>
			</div>
		{/if}
	</div>
</section>

<!-- Main Projects Section -->
<section class="bg-gradient-to-b from-white to-[#faf7f3] px-6 py-16 sm:px-12 lg:px-24">
	<div class="mx-auto max-w-7xl">
		<div
			class="grid gap-8 lg:gap-12 {projects.length > 2
				? 'md:grid-cols-2 lg:grid-cols-3'
				: 'md:grid-cols-2'}"
		>
			{#each projects as project, index (project.id)}
				{#if mounted}
					<div
						class="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
						in:fly={{ y: 50, duration: 600, delay: index * 200 }}
					>
						<!-- Category Badge -->
						<div class="absolute top-4 left-4 z-10">
							<span
								class="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#9d5d2c] shadow-md backdrop-blur-sm"
							>
								{project.category}
							</span>
						</div>

						<!-- Project Image -->
						<div
							class="relative h-56 overflow-hidden bg-gradient-to-br from-[#9d5d2c]/10 to-[#7c451f]/20"
						>
							<img
								src={project.image}
								alt="{project.title} preview"
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
								loading="lazy"
								on:error={(e) => {
									// Fallback gradient if image fails to load
									const target = e.target as HTMLImageElement;
									if (target) {
										target.style.display = 'none';
									}
								}}
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
						</div>

						<!-- Content -->
						<div class="p-6">
							<h2
								class="mb-3 text-2xl font-bold text-[#9d5d2c] transition-colors duration-300 group-hover:text-[#7c451f]"
							>
								{project.title}
							</h2>
							<p class="mb-6 leading-relaxed text-gray-600">
								{project.description}
							</p>

							<!-- Call to Action -->
							<a
								href={project.link}
								class="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#9d5d2c] to-[#b96b30] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 group-hover:scale-105 hover:from-[#7c451f] hover:to-[#9d5d2c] hover:shadow-xl focus:ring-4 focus:ring-[#9d5d2c]/30 focus:outline-none"
							>
								{project.cta}
								<svg
									class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									></path>
								</svg>
							</a>
						</div>

						<!-- Decorative Border -->
						<div
							class="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[#9d5d2c]/20 via-transparent to-[#b96b30]/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						></div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<!-- User Status Section -->
{#if userSession && mounted}
	<section
		class="bg-gradient-to-r from-[#9d5d2c] to-[#b96b30] py-12"
		in:fade={{ duration: 600, delay: 800 }}
	>
		<div class="mx-auto max-w-4xl px-6 text-center sm:px-12">
			<div class="rounded-2xl border border-white/20 bg-white/10 px-8 py-6 backdrop-blur-sm">
				<div class="mb-4 flex items-center justify-center">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
					>
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
				</div>
				<h3 class="mb-2 text-xl font-bold text-white">Welcome back!</h3>
				<p class="text-white/90">
					You're logged in and ready to explore exclusive project insights and participate in our
					initiatives.
				</p>
			</div>
		</div>
	</section>
{/if}

<!-- Call to Action Section -->
<section class="bg-[#faf7f3] px-6 py-16 sm:px-12 lg:px-24">
	<div class="mx-auto max-w-4xl text-center">
		{#if mounted}
			<div in:fade={{ duration: 600, delay: 400 }}>
				<h2 class="mb-6 text-3xl font-bold text-[#9d5d2c] sm:text-4xl">Ready to Make an Impact?</h2>
				<p class="mb-8 text-lg leading-relaxed text-gray-700">
					Join our community of change-makers and start your journey toward meaningful action today.
				</p>
				<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
					<a
						href="/join"
						class="inline-flex items-center rounded-xl bg-gradient-to-r from-[#9d5d2c] to-[#b96b30] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-[#7c451f] hover:to-[#9d5d2c] hover:shadow-xl focus:ring-4 focus:ring-[#9d5d2c]/30 focus:outline-none"
					>
						Get Involved
						<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							></path>
						</svg>
					</a>
					<a
						href="/about"
						class="inline-flex items-center rounded-xl border-2 border-[#9d5d2c] bg-transparent px-8 py-4 text-lg font-semibold text-[#9d5d2c] transition-all duration-300 hover:scale-105 hover:bg-[#9d5d2c] hover:text-white focus:ring-4 focus:ring-[#9d5d2c]/30 focus:outline-none"
					>
						Learn More
					</a>
				</div>
			</div>
		{/if}
	</div>
</section>
