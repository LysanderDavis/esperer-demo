<!-- src/lib/components/statisty/MetricCard.svelte -->
<script lang="ts">
	export let title: string;
	export let value: string | number;
	export let trend: 'up' | 'down' | 'stable';
	export let loading = false;
</script>

<div class="rounded-lg bg-white p-6 shadow-md">
	<h3 class="mb-2 text-lg font-semibold">{title}</h3>
	{#if loading}
		<div class="h-8 animate-pulse rounded bg-gray-200"></div>
	{:else}
		<div class="text-2xl font-bold">{value}</div>
		<div class="text-sm text-gray-500">
			{#if trend === 'up'}📈{:else if trend === 'down'}📉{:else}➡️{/if}
		</div>
	{/if}
</div>
