<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import type { User } from '@supabase/supabase-js';

	let user: User | null = null;

	onMount(async () => {
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();
		user = currentUser;
	});
</script>

<h1 class="text-2xl font-semibold">Welcome to Statisty</h1>

{#if user}
	<p class="mt-4">Logged in as {user.email}</p>
{:else}
	<p class="mt-4">Not logged in.</p>
{/if}
