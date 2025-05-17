<script>
	import Typography from '$lib/components/Typography.svelte';
	import HeroSection from '$lib/components/homepage/HeroSection.svelte';
	import StatsCounter from '$lib/components/homepage/StatsCounter.svelte';
	import Gallery from '$lib/components/homepage/Gallery.svelte';
	import JournalSection from '$lib/components/homepage/JournalSection.svelte';

	// Here, define your stats once to make it easy to update
	const stats = {
		peopleReached: 20,
		volunteers: 4,
		countriesReached: 1
	};
</script>

<HeroSection />

<section class="py-20">
	<div class="text-center">
		<Typography variant="h2" className=" text-5xl font-bold text-[#9d5d2c]">Our Impact</Typography>

		<div class="mt-10 grid grid-cols-1 gap-8 px-6 sm:grid-cols-3">
			<StatsCounter label="People Reached" count={stats.peopleReached} />
			<StatsCounter label="Volunteers" count={stats.volunteers} />
			<StatsCounter label="Countries Reached" count={stats.countriesReached} />
		</div>

		<Typography
			variant="body"
			className="
    mt-8 max-w-3xl mx-auto text-2xl italic text-gray-700 dark:text-gray-300 px-6 leading-relaxed
    drop-shadow-sm
  "
		>
			<span
				lang="fr"
				class="font-extrabold text-[#9d5d2c]"
			>
				Espérer
			</span>
			spans across&nbsp;
			<span class="font-extrabold text-[#9d5d2c]"
				>1</span
			>&nbsp;continent reaching&nbsp;
			<span class="font-extrabold text-[#9d5d2c]"
				>{stats.countriesReached}</span
			>&nbsp; countries and mobilizing&nbsp;
			<span class="font-extrabold text-[#9d5d2c]"
				>{stats.volunteers}</span
			>&nbsp; dedicated volunteers who make a&nbsp;
			<span class="font-extrabold text-[#9d5d2c]"
				>difference</span
			>
			not only in their local community, but&nbsp;
			<span class="font-extrabold text-[#9d5d2c]"
				>worldwide</span
			>.
		</Typography>
	</div>
</section>

<Gallery />

<JournalSection />
