<script>
	import Typography from '$lib/components/Typography.svelte';
	import HeroSection from '$lib/components/homepage/HeroSection.svelte';
	import StatsCounter from '$lib/components/homepage/StatsCounter.svelte';
	import Gallery from '$lib/components/homepage/Gallery.svelte';;

	// Here, define your stats once to make it easy to update
	const stats = {
		peopleReached: 20,
		volunteers: 5,
		countriesReached: 1
	};
</script>

<HeroSection />

<section class="py-20">
	<div class="text-center">
		<Typography variant="h2" className=" text-5xl font-bold text-[#9d5d2c]"
			>Our Impact</Typography
		>

		<div class="mt-10 grid grid-cols-1 gap-8 px-6 sm:grid-cols-3">
			<StatsCounter label="People Reached" count={stats.peopleReached} />
			<StatsCounter label="Volunteers" count={stats.volunteers} />
			<StatsCounter label="Countries Reached" count={stats.countriesReached} />
		</div>

		<Typography variant="body" className="mt-5 max-w-3xl mx-auto text-xl italic text-gray-700 px-4">
			<span lang="fr" class="font-bold text-[#9d5d2c]">Espérer</span> spans across
			<span class="font-bold text-[#9d5d2c]">1</span>
			continents reaching <span class="font-bold text-[#9d5d2c]">{stats.countriesReached}</span>
			countries and mobilizing <span class="font-bold text-[#9d5d2c]">{stats.volunteers}</span>
			dedicated volunteers who make a <span class="font-bold text-[#9d5d2c]">difference</span> not
			only in their local community, but <span class="font-bold text-[#9d5d2c]">worldwide</span>.
		</Typography>
	</div>
</section>

<Gallery />
