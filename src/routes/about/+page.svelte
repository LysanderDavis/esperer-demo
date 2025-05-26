<script lang="ts">
	import Typography from '$lib/components/Typography.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	// Data for the six pillars
	const pillars = [
		{
			title: 'Hope',
			description:
				'Espérer was founded with one vital goal in mind: instill hope in humanity to eradicate climate change and its side effects. However close the Earth temperature approaches 2.0ºC, we remain hopeful.'
		},
		{
			title: 'Perseverance',
			description:
				'We understand that fighting for the environment is an uphill battle, a trench warfare if you will. Instead of doomerism, we begin the fight and never surrender. We never leave the arena until we win. Never.'
		},
		{
			title: 'Community',
			description:
				'Espérer is not just a monthly magazine. Neither is it a recycling center location app, or podcast series and YouTube content. Espérer is an idea that a community of independent, free thinkers is capable of anything.'
		},
		{
			title: 'Integrity',
			description:
				'Espérer is not done just for another tick. We value transparency and accountability and abide by our strong ethical principles to make a REAL difference in the world.'
		},
		{
			title: 'Innovation',
			description:
				"Being a seed of human creativity, innovative ideas always drive us forward, whether locally or globally, and they always will. As we tighten our grip, let's innovate our way to a sustainable future."
		},
		{
			title: 'Competence',
			description:
				'Espérer focuses on achieving the greatest possible impact by delivering credible and well-researched content, ideas, and solutions. We work to ensure that every message is thoughtful and informed.'
		}
	];

	let visiblePillars = Array(pillars.length).fill(false);
	let loaded = false;

	onMount(() => {
		loaded = true;
		const revealPillars = () => {
			pillars.forEach((_, index) => {
				setTimeout(() => {
					visiblePillars[index] = true;
				}, 300 * index);
			});
		};

		// Start revealing pillars after a short delay
		setTimeout(revealPillars, 300);
	});

	// Helper function to check if element is in viewport
	function isInViewport(element: Element | null) {
		if (!element) return false;
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}
</script>

<svelte:head>
	<title>Six Pillars of Espérer | Mapping a Sustainable Future</title>
	<meta
		name="description"
		content="The Six Pillars of Espérer: Hope, Perseverance, Community, Integrity, Innovation, and Competence - guiding us towards a sustainable future"
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-32 pb-16">
	<div class="mx-auto max-w-5xl px-6">
		<!-- Hero Section -->
		<div class="mb-16 text-center">
			<Typography variant="h1" className="text-[#9d5d2c] mb-6 text-4xl md:text-5xl">
				<span lang="fr">The Six Pillars of Espérer</span>
			</Typography>

			<Typography variant="body" className="text-[#9d5d2c]/80 max-w-2xl mx-auto">
				Our foundation is built upon six fundamental principles that guide our work and shape our
				vision for a sustainable future.
			</Typography>
		</div>

		<!-- Pillars Grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			{#each pillars as pillar, i}
				{#if loaded}
					{#if visiblePillars[i]}
						<div
							class="rounded-lg border border-[#b06b35]/10 bg-white p-8 shadow-md transition-all duration-300 hover:translate-y-1 hover:bg-[#b06b35]/5 hover:shadow-lg"
							transition:fly={{ y: 30, duration: 700, delay: i * 120, easing: quintOut }}
						>
							<div class="mb-4 flex items-center">
								<Typography variant="h2" className="text-[#9d5d2c]">
									{pillar.title}
								</Typography>
							</div>

							<Typography variant="body" className="text-gray-700">
								{pillar.description}
							</Typography>
						</div>
					{/if}
				{/if}
			{/each}
		</div>

		<!-- Call to action -->
		<div class="mt-16 text-center">
			<Typography variant="h3" className="text-[#9d5d2c] mb-6 text-4xl md:text-4xl"
				>Join Our Mission</Typography
			>

			<a
				href="/join"
				class="inline-block rounded-lg bg-[#b06b35] px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#9d5d2c]"
			>
				Get Involved Today
			</a>
		</div>
	</div>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
