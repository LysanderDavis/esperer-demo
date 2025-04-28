<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
</script>

<main class="min-h-screen bg-[your-color">
	<Header />
	<slot />
	<Footer />
</main>
