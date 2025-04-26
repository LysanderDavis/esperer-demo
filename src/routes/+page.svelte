<script>
	import HeroSection from '$lib/components/homepage/HeroSection.svelte';
	import StatsCounter from '$lib/components/homepage/StatsCounter.svelte';
	import AboutSection from '$lib/components/homepage/AboutSection.svelte';
	import WorldMap from '$lib/components/homepage/WorldMap.svelte';
</script>

<HeroSection />

<section class="grid grid-cols-1 gap-6 bg-white py-12 text-center sm:grid-cols-3">
	<StatsCounter label="Trees Planted" count={102312} />
	<StatsCounter label="Volunteers" count={7812} />
	<StatsCounter label="Countries Reached" count={32} />
</section>

<AboutSection />
<WorldMap />
