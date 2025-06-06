<script lang="ts">
	import BMICalculator from '$lib/components/statisty/BMICalculator.svelte';
	import CarbonEstimator from '$lib/components/statisty/CarbonEstimator.svelte';
	import SleepTracker from '$lib/components/statisty/SleepTracker.svelte';
	import AirQualityIndicator from '$lib/components/statisty/AirQualityIndicator.svelte';
</script>

<div class="grid gap-4">
	<BMICalculator />
	<CarbonEstimator />
	<SleepTracker />
	<AirQualityIndicator />
</div>
