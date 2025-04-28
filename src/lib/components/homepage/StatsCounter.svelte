<script lang="ts">
	import { onMount } from 'svelte';
	import Typography from '$lib/components/Typography.svelte';

	export let label = 'Trees Planted';
	export let count = 100000;

	let current = 0;
	let duration = 2000; // animation duration in ms
	let hasAnimated = false;
	let element: HTMLDivElement;

	function startAnimation() {
		if (hasAnimated) return;
		hasAnimated = true;

		const start = performance.now();

		function animate(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			current = Math.floor(progress * count);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				current = count;
			}
		}

		requestAnimationFrame(animate);
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						startAnimation();
						observer.disconnect();
					}
				});
			},
			{
				threshold: 0.5 // start when 50% visible
			}
		);

		if (element) {
			observer.observe(element);
		}
	});
</script>

<div bind:this={element} class="p-24 text-center">
	<Typography variant="h1" className="text-[#9d5d2c] text-6xl">
		{current.toLocaleString()}
	</Typography>
	<Typography variant="body" className="text-secondary mt-2 text-2xl">
		{label}
	</Typography>
</div>
