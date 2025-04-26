<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
</script>

<main class="bg-[your-color] min-h-screen">
  <Header />
    {@render children()}
  <Footer />
</main>
