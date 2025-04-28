<script lang="ts">
	import Typography from '$lib/components/Typography.svelte';
	import { fly } from 'svelte/transition';

	const pillars = [
		{
			title: 'Hope',
			content: `Espérer was founded with one vital goal in mind: to instill hope in humanity to eradicate climate change and its side effects. However close the Earth's temperature approaches 2.0ºC, we remain hopeful. If we don’t bring necessary change today, we will tomorrow.`
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

<section class="relative flex flex-col items-center overflow-hidden pt-40 sm:px-12 lg:px-24">
	<!-- Decorative Background Blobs -->
	<div
		class="absolute -top-20 left-0 h-64 w-64 rounded-full bg-[#f5e4d7] opacity-50 blur-2xl"
	></div>
	<div
		class="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#f5e4d7] opacity-50 blur-2xl"
	></div>

	<!-- Decorative Squiggles -->
	<img
		src="/squiggle1.svg"
		alt=""
		class="animate-floating absolute top-20 left-10 w-24 opacity-20"
	/>
	<img
		src="/squiggle2.svg"
		alt=""
		class="animate-floating-reverse absolute right-10 bottom-20 w-24 opacity-20"
	/>

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
	<!-- Smooth Fade Transition into Footer -->
	<div class="h-24 w-full bg-gradient-to-b from-transparent to-[#b06b35]"></div>


<style>
	@keyframes floating {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes floating-reverse {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(10px);
		}
	}

	.animate-floating {
		animation: floating 6s ease-in-out infinite;
	}

	.animate-floating-reverse {
		animation: floating-reverse 6s ease-in-out infinite;
	}
</style>
