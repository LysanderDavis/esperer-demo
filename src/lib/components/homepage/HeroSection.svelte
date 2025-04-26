<script lang="ts">
	import Typography from '../Typography.svelte';

	interface NetworkInformation extends Navigator {
		connection?: {
			downlink: number;
		};
	}

	let imageSrc = '/horse-low-res.jpg'; // default to low res

	if (typeof navigator !== 'undefined') {
		const connection = (navigator as unknown as NetworkInformation).connection;
		const downlink = connection?.downlink;

		if (downlink && downlink >= 5) {
			imageSrc = '/horse-high-res.jpg';
		}
	}
</script>

<section class="relative h-screen w-full overflow-hidden">
	<!-- Background Image -->
	<img src={imageSrc} alt="A man on the horse next to stunning mountains" class="absolute inset-0 h-full w-full object-cover" />

	<!-- Overlay -->
	<div class="absolute inset-0 bg-black/30"></div>

	<!-- Content -->
	<div class="relative z-10 flex h-full items-center justify-end px-8 md:px-16">
		<div class="max-w-xl space-y-6 text-right text-white">
			<Typography variant="h1" className="text-4xl md:text-6xl">
				Real change begins<br />with Espérer
			</Typography>

			<Typography variant="body" className="text-lg md:text-xl">
				Expanding horizons, never settle down.<br />New strength, new pathways, real change.
			</Typography>

			<button
				class="mt-4 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
			>
				Explore Now →
			</button>
		</div>
	</div>

	<!-- Diagonal Cut -->
	<div
		class="absolute bottom-0 left-0 h-32 w-full bg-white"
		style="clip-path: polygon(0 0, 100% 100%, 0 100%);"
	></div>
</section>
