<!-- src/lib/components/Typography.svelte -->

<script lang="ts">
	export let variant: 'h1' | 'h2' | 'h3' | 'body' | 'small' = 'body';
	export let className = '';
</script>

{#if variant === 'h1'}
	<h1 class={`font-heading text-h1 font-bold ${className}`}><slot /></h1>
{:else if variant === 'h2'}
	<h2 class={`font-heading text-h2 font-semibold ${className}`}><slot /></h2>
{:else if variant === 'h3'}
	<h3 class={`font-heading text-h3 font-semibold ${className}`}><slot /></h3>
{:else if variant === 'body'}
	<p class={`text-body font-sans ${className}`}><slot /></p>
{:else if variant === 'small'}
	<p class={`text-small text-secondary font-sans ${className}`}><slot /></p>
{/if}
