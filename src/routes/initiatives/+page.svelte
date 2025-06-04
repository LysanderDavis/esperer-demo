<script lang="ts">
	import Typography from '$lib/components/Typography.svelte';

	const projects = [
		{
			name: 'Statisty',
			description:
				'A quantified self platform empowering individuals to understand and optimize their lives through data.',
			image: '/statisty-banner.png',
			link: '/initiatives/statisty'
		}
	];
</script>

<section class="min-h-screen bg-[#fdfcfb] px-6 pt-36 sm:px-12 lg:px-24">
	<Typography variant="h1" className="mb-12 text-[#9d5d2c] text-4xl sm:text-4xl"
		>Our Initiatives</Typography
	>

	<div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
		{#each projects as project}
			<a
				href={project.link}
				class="group overflow-hidden rounded-2xl border border-[#ddd] bg-white shadow transition-shadow duration-300 hover:shadow-xl"
			>
				<img
					src={project.image}
					alt={project.name}
					class="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				<div class="p-6">
					<Typography
						variant="h2"
						className="text-[#9d5d2c] text-1xl sm:text-2xl"
					>
						{project.name}
					</Typography>
					<Typography variant="body" className="mt-4 text-gray-700 text-1xl leading-relaxed">
						{project.description}
					</Typography>
				</div>
			</a>
		{/each}
	</div>
</section>
