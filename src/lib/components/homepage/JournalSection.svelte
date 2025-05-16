<script lang="ts">
	import Typography from '$lib/components/Typography.svelte';
</script>

<section class="py-2 mt-25 mb-25 ml-5 mr-5">
	<div class="mx-auto flex max-w-6xl flex-col md:flex-row items-center md:items-start gap-12">
		<!-- Image first on mobile, stays prominent -->
		<img
			src="/journal.png"
			alt="Espérer book cover"
			class="w-full max-w-md sm:max-w-lg drop-shadow-[15px_15px_30px_rgba(0,0,0,0.25)]"
		/>

		<!-- Text content below on mobile, beside on desktop -->
		<div class="flex-1 space-y-8 text-[#3b2f24] text-center md:text-left mt-auto mb-auto">
			<Typography variant="h2" className="text-4xl sm:text-5xl leading-tight">
				Espérer: Global Water Reckoning
			</Typography>

			<Typography variant="body" className="text-base sm:text-lg leading-relaxed opacity-90">
				In <strong lang="fr">Espérer</strong>, we embark on a journey across rivers, lakes, and the policies
				that shape them. This volume unpacks the environmental crises surrounding global water
				systems—from drought-stricken lands to flood-ravaged coastlines—with clarity and resolve.
			</Typography>

			<Typography variant="body" className="text-base sm:text-lg leading-relaxed">
				Explore the science behind water scarcity, the ethics of consumption, and the socioeconomic
				consequences for communities caught in the tides of climate change. What does it mean to
				hope in a time of reckoning? How can we balance development with ecological responsibility?
			</Typography>

			<Typography variant="body" className="text-base sm:text-lg leading-relaxed">
				By tracing the stories of those who depend on water the most, we begin to understand the
				power it holds—and the future we must shape together.
			</Typography>

			<Typography variant="body" className="italic text-[#70492b] text-lg sm:text-xl pt-2">
				Step into the flow of consequence. Dare to hope with <em lang="fr">Espérer</em>.
			</Typography>
		</div>
	</div>
</section>
