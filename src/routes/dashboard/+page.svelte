<script lang="ts">
	import { user } from '$lib/stores/user.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	onMount(() => {
		if (!get(user)) {
			goto('/');
		}
	});
</script>

<slot />
