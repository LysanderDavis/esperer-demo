<!-- src/lib/components/recycle-near-me/LocationPermissionCard.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Typography from '$lib/components/Typography.svelte';

	export let locationError = '';

	const dispatch = createEventDispatcher();

	function handleGrantPermission() {
		dispatch('grant');
	}
</script>

<div class="rounded-xl border border-green-200 bg-white p-8 shadow-lg">
	<div class="mx-auto max-w-md text-center">
		<div class="mb-6">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
			>
				<span class="text-2xl">📍</span>
			</div>
			<Typography variant="h2" className="text-gray-800 mb-4">Enable Location Access</Typography>
			<Typography variant="body" className="text-gray-600 mb-6">
				To find recycling centers near you, we need access to your location. This helps us show the
				most relevant recycling options in your area.
			</Typography>
		</div>

		{#if locationError}
			<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
				<div class="flex items-center">
					<span class="mr-2 text-red-400">⚠️</span>
					<p class="text-sm text-red-700">{locationError}</p>
				</div>
			</div>
		{/if}

		<div class="space-y-4">
			<button
				on:click={handleGrantPermission}
				class="flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
			>
				<span class="mr-2">🗺️</span>
				Grant Location Permission
			</button>

			<div class="text-sm text-gray-500">
				<p class="mb-2">Why we need location access:</p>
				<ul class="mx-auto max-w-xs space-y-1 text-left">
					<li class="flex items-start">
						<span class="mt-0.5 mr-2 text-green-500">•</span>
						<span>Find nearby recycling centers</span>
					</li>
					<li class="flex items-start">
						<span class="mt-0.5 mr-2 text-green-500">•</span>
						<span>Calculate distances and directions</span>
					</li>
					<li class="flex items-start">
						<span class="mt-0.5 mr-2 text-green-500">•</span>
						<span>Provide location-specific information</span>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-6 rounded-lg bg-green-50 p-4">
			<p class="text-sm text-green-700">
				<span class="font-medium">🔒 Privacy:</span> Your location data is only used to find nearby recycling
				centers and is not stored on our servers.
			</p>
		</div>
	</div>
</div>
