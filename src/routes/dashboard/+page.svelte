<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user.js';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	onMount(() => {
		if (!get(user)) {
			goto('/'); // redirect to home if not logged in
		}
	});
</script>

<h1>Dashboard</h1>
<p>Welcome to your dashboard!</p>
