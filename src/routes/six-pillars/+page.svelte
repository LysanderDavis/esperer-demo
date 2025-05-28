<script lang="ts">
	import Typography from '$lib/components/Typography.svelte';
	import { fly } from 'svelte/transition';

	const pillars = [
		{
			title: 'Hope',
			content: `Espérer was founded with one vital goal in mind: to instill hope in humanity to eradicate climate change and its side effects. However close the Earth's temperature approaches 2.0ºC, we remain hopeful. If we don't bring necessary change today, we will tomorrow.`
		},
		{
			title: 'Perseverance',
			content: `Fighting for the environment is an uphill battle — trench warfare. Instead of doomerism, we fight and never surrender. Never leave the arena until we win.`
		},
		{
			title: 'Community',
			content: `Espérer is more than a magazine or an app. It is a living idea: free, independent thinkers united to change the world. Time to stop climate change.`
		},
		{
			title: 'Integrity',
			content: `At Espérer, action is genuine. We value transparency, accountability, and strong ethics, ensuring every member aligns with our real-world mission.`
		},
		{
			title: 'Innovation',
			content: `Innovation drives everything we do. Local or global, creative ideas power our journey toward a sustainable future.`
		},
		{
			title: 'Competence',
			content: `Espérer delivers credible, thoughtful solutions crafted to inspire true action — every message informed and designed to change the world.`
		}
	];
</script>

<svelte:head>
	<title>Six Pillars of Espérer | Mapping a Sustainable Future</title>
	<meta
		name="description"
		content="The Six Pillars of Espérer: Hope, Perseverance, Community, Integrity, Innovation, and Competence - guiding us towards a sustainable future"
	/>
</svelte:head>
<section class="relative flex flex-col items-center overflow-hidden pt-40 sm:px-12 lg:px-24">
	<!-- Decorative Background Blobs -->
	<div
		class="absolute -top-20 left-0 h-64 w-64 rounded-full bg-[#f5e4d7] opacity-50 blur-2xl"
	></div>
	<div
		class="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#f5e4d7] opacity-50 blur-2xl"
	></div>

	<!-- Title -->
	<Typography variant="h1" className="text-center text-[#9d5d2c] mb-16 relative z-10 text-5xl">
		Six Pillars of <span lang="fr">Espérer</span>
	</Typography>

	<!-- Pillars -->
	<div class="relative z-10 grid max-w-6xl grid-cols-1 gap-20 md:grid-cols-2">
		{#each pillars as pillar, i (i)}
			<div
				class="group rounded-3xl bg-white p-10 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
				in:fly={{ y: 50, duration: 600 }}
			>
				<div class="mb-6 flex items-center space-x-6">
					<div
						class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#b06b35] text-xl font-bold text-white"
					>
						{String(i + 1).padStart(2, '0')}
					</div>
					<Typography
						variant="h2"
						className="text-[#9d5d2c] group-hover:text-[#a09175] text-3xl transition-colors"
					>
						{pillar.title}
					</Typography>
				</div>
				<Typography variant="body" className="text-lg leading-relaxed text-gray-700">
					{@html pillar.content.replaceAll('Espérer', '<span lang="fr">Espérer</span>')}
				</Typography>
			</div>
		{/each}
	</div>

	<!-- Fun Playful Closing -->
	<div class="relative z-10 mt-32 mb-12 flex w-full flex-col items-center px-4 text-center">
		<div class="max-w-3xl rounded-3xl bg-[#fdf8f4] p-10 shadow-md">
			<Typography variant="h3" className="text-[#9d5d2c] mb-6 text-4xl md:text-5xl leading-tight">
				Together, we build a future worth dreaming about.
			</Typography>
			<Typography
				variant="body"
				className="opacity-80 text-lg md:text-xl leading-relaxed text-gray-700"
			>
				Join <span lang="fr">Espérer</span> and become the spark that changes everything.
			</Typography>
		</div>
	</div>
</section>

<style>
	.max-w-3xl {
		position: relative;
		background: #fdf8f4;
		padding: 2.5rem 2.5rem; /* same as p-10 */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		border-radius: 1.5rem; /* rounded-3xl */
	}

	.max-w-3xl::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -20px; /* just below the container */
		height: 40px;
		background: url('data:image/svg+xml;utf8,<svg width="100%" height="40" viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg"><path fill="%23fdf8f4" d="M0,40 C360,0 1080,80 1440,40 L1440,40 L0,40 Z"/></svg>')
			repeat-x bottom;
		background-size: contain;
		filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.1));
		border-bottom-left-radius: 1.5rem;
		border-bottom-right-radius: 1.5rem;
		pointer-events: none;
	}
</style>
