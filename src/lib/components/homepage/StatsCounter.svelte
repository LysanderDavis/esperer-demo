<script lang="ts">
	export let label = 'Trees Planted';
	export let count = 100000;
	import Typography from '$lib/components/Typography.svelte';
</script>

<div class="text-center">
	<Typography variant="h1" className="text-[#9d5d2c] text-6xl">
		{count.toLocaleString()}
	</Typography>
	<Typography variant="body" className="text-secondary mt-2 text-2xl">
		{label}
	</Typography>
</div>
