<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import { user } from '$lib/stores/user.js';

	onMount(async () => {
		const {
			data: { session }
		} = await supabase.auth.getSession();

		user.set(session?.user ?? null);

		supabase.auth.onAuthStateChange((_event, session) => {
			user.set(session?.user ?? null);
		});
	});
</script>

<svelte:head>
	<title>Espérer</title>
	<meta property="og:title" content="Espérer" />
	<meta property="og:url" content="https://esperer.netlify.app" />
	<meta
		property="og:image"
		content="https://esperer.netlify.app/esperer-high-resolution-logo.png"
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="description" content="Mapping a Sustainable Future" />
	<meta property="og:description" content="Mapping a Sustainable Future" />
	<meta property="og:site_name" content="Espérer" />
	<meta name="twitter:title" content="Espérer" />
	<meta
		property="twitter:image"
		content="https://esperer.netlify.app/esperer-high-resolution-logo.png"
	/>
</svelte:head>

<main class="min-h-screen bg-[your-color]">
	<Header />
	<slot />
	<Footer />
</main>
