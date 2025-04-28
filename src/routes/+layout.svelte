<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
</script>

<main class="min-h-screen bg-[your-color]">
	<Header />

	<div class="w-full border-t border-black"></div>
	{@render children()}
	<Footer />
</main>
