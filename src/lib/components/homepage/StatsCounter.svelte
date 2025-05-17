<script lang="ts">
	import { onMount } from 'svelte';
	import Typography from '$lib/components/Typography.svelte';

	export let label = 'Lives touched by our journey';
	export let count = 100000;

	let current = 0;
	let duration = 2000;
	let hasAnimated = false;
	let element: HTMLDivElement;
	let clicked = false;

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

	function handleClick() {
		clicked = !clicked;
		// For example: alert or toggle some state
		// alert(`Card clicked! Current count: ${current}`);
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
				threshold: 0.5
			}
		);

		if (element) {
			observer.observe(element);
		}
	});
</script>

<div bind:this={element} class="flex items-center justify-center p-6">
	<div
		role="button"
		tabindex="0"
		class="card w-full max-w-sm rounded-2xl bg-white p-10 text-center"
		class:clicked
		style="box-shadow: 0 10px 25px rgba(157, 93, 44, 0.4);"
		on:click={handleClick}
		on:keydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleClick();
			}
		}}
	>
		<Typography
			variant="h1"
			className="text-[#9d5d2c] text-6xl font-bold"
		>
			{current.toLocaleString()}
		</Typography>
		<Typography
			variant="body"
			className="text-gray-600 dark:text-gray-300 mt-4 text-xl leading-relaxed italic"
		>
			{label}
		</Typography>
	</div>
</div>

<style>
	.card {
		cursor: pointer;
		transition:
			box-shadow 0.3s ease,
			transform 0.3s ease;
	}
	.card:hover {
		box-shadow: 0 15px 30px rgba(157, 93, 44, 0.7);
		transform: translateY(-10px) scale(1.05);
	}
	.card.clicked {
		border: 3px solid #9d5d2c;
	}
</style>
