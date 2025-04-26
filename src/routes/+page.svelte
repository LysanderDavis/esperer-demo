<script>
	import Typography from '$lib/components/Typography.svelte';
	import HeroSection from '$lib/components/homepage/HeroSection.svelte';
	import StatsCounter from '$lib/components/homepage/StatsCounter.svelte';
	import AboutSection from '$lib/components/homepage/AboutSection.svelte';
	import WorldMap from '$lib/components/homepage/WorldMap.svelte';
</script>

<HeroSection />

<section class="grid grid-cols-1 gap-6 bg-white py-12 text-center sm:grid-cols-3">
	<StatsCounter label="People Reached" count={0} />
	<StatsCounter label="Volunteers" count={5} />
	<StatsCounter label="Countries Reached" count={1} />
</section>

<AboutSection />
<WorldMap />
