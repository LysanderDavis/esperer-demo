<script lang="ts">
	import Typography from '$lib/components/Typography.svelte';
	import { onMount } from 'svelte';

	const baseNames = ['IMG_1', 'IMG_2', 'IMG_3', 'IMG_4', 'IMG_5', 'IMG_6'];

	// Initially use compressed images
	let photos = baseNames.map((name) => ({
		low: `/${name}-comp.jpg`,
		high: `/${name}.JPG`,
		current: `/${name}-comp.jpg`
	}));

	// On mount, try loading the high-quality images
	onMount(() => {
		photos.forEach((photo, index) => {
			const img = new Image();
			img.src = photo.high;
			img.onload = () => {
				photos[index].current = photo.high;
			};
		});
	});
</script>

<section class="flex flex-col items-center bg-[#9d5d2c] p-24">
	<Typography variant="h2" className="pb-24 text-5xl text-white">Our Photo Gallery</Typography>

	<div class="mb-14 flex flex-wrap justify-center gap-8 rounded-3xl bg-[#9d5d2c]">
		{#each photos as photo, i}
			<div
				class="h-60 w-80 transform overflow-hidden rounded-2xl border-4 border-white bg-white transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
				style="transform: rotate({i % 2 === 0 ? '-3deg' : '3deg'});"
			>
				<img
					src={photo.current}
					alt="Gallery object"
					class="h-full w-full object-cover transition duration-300 ease-in-out hover:scale-110"
				/>
			</div>
		{/each}
	</div>

	<button
		class="mt-6 rounded-full border-4 border-white bg-[#9d5d2c] px-10 py-5 text-lg font-bold text-white shadow-md transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#9d5d2c] hover:shadow-2xl"
	>
		View More
	</button>
</section>
