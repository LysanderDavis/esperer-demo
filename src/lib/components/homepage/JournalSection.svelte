<script lang="ts">
	import Typography from '$lib/components/Typography.svelte';
</script>

<section class="mt-25 mr-5 mb-25 ml-5 py-2">
	<div class="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:items-start">
		<!-- Image first on mobile, stays prominent -->
		<img
			src="/journal.png"
			alt="Espérer book cover"
			class="w-full max-w-md drop-shadow-[15px_15px_30px_rgba(0,0,0,0.25)] sm:max-w-lg"
		/>

		<!-- Text content below on mobile, beside on desktop -->
		<div class="mt-auto mb-auto flex-1 space-y-8 text-center text-[#3b2f24] md:text-left">
			<Typography variant="h2" className="text-4xl sm:text-5xl leading-tight">
				Espérer: Global Water Reckoning
			</Typography>

			<Typography variant="body" className="text-base sm:text-lg leading-relaxed opacity-90">
				In our monthly e-magazine series, we reveal the most pressing environmental issues from all
				around the world and their potential solutions. Each publication will focus on a specific
				topic, including but not limited to deforestation, marine life, agriculture, energy, and so
				much more.
			</Typography>

			<Typography variant="body" className="text-base sm:text-lg leading-relaxed">
				Explore the science behind water scarcity, the ethics of consumption, and the socioeconomic
				consequences for communities caught in the tides of climate change. What does it mean to
				hope in a time of reckoning? How can we balance development with environmental
				responsibility?
			</Typography>

			<Typography variant="body" className="text-base sm:text-lg leading-relaxed">
				By tracing the stories of those who depend on water the most, we begin to understand the
				power it holds—and the future we must shape together.
			</Typography>

			<Typography variant="body" className="italic text-[#70492b] text-lg sm:text-xl pt-2">
				Step into the flow of consequence. Dare to hope with <em lang="fr">Espérer</em>.
			</Typography>

			<div class="pt-4">
				<button
					class="transform rounded-xl bg-[#9d5d2c] px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:scale-105 hover:bg-[#5c3d24] focus:ring-2 focus:ring-[#70492b] focus:ring-offset-2 focus:outline-none"
				>
					GET FOR FREE
				</button>
			</div>
		</div>
	</div>
</section>
