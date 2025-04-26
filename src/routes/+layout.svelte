<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
</script>

<Header />
{@render children()}

<!-- <div class="min-h-screen">
	<slot />
</div> -->

<Footer />
