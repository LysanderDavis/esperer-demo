<!-- src/lib/components/recycle-near-me/SubmissionForm.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Typography from '$lib/components/Typography.svelte';

	const dispatch = createEventDispatcher();

	let name = '';
	let address = '';
	let materials: string[] = [];
	let notes = '';
	let isSubmitting = false;

	const availableMaterials = [
		'Paper',
		'Cardboard',
		'Plastic',
		'Glass',
		'Metal',
		'Electronics',
		'Batteries',
		'Textiles',
		'Organic/Compost',
		'Hazardous Waste',
		'Oil',
		'Tires'
	];

	function toggleMaterial(material: string) {
		if (materials.includes(material)) {
			materials = materials.filter((m) => m !== material);
		} else {
			materials = [...materials, material];
		}
	}

	async function handleSubmit() {
		if (!name.trim() || !address.trim() || materials.length === 0) {
			alert('Please fill in all required fields and select at least one material type.');
			return;
		}

		isSubmitting = true;

		try {
			dispatch('submit', {
				name: name.trim(),
				address: address.trim(),
				materials,
				notes: notes.trim()
			});
		} catch (error) {
			console.error('Submission error:', error);
			alert('Failed to submit. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		dispatch('cancel');
	}
</script>

<div class="rounded-xl bg-white p-8 shadow-lg">
	<div class="mb-6">
		<Typography variant="h2" className="text-gray-800 mb-2">🏢 Add New Recycling Center</Typography>
		<Typography variant="body" className="text-gray-600">
			Help your community by adding a recycling center that's not on our map yet. All submissions
			are reviewed before being published.
		</Typography>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<!-- Name Field -->
		<div>
			<label for="name" class="mb-2 block text-sm font-medium text-gray-700"> Center Name * </label>
			<input
				id="name"
				type="text"
				bind:value={name}
				placeholder="e.g., Green Valley Recycling Center"
				class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
				required
			/>
		</div>

		<!-- Address Field -->
		<div>
			<label for="address" class="mb-2 block text-sm font-medium text-gray-700">
				Full Address *
			</label>
			<input
				id="address"
				type="text"
				bind:value={address}
				placeholder="e.g., 123 Main Street, City, State, ZIP Code"
				class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
				required
			/>
			<p class="mt-1 text-sm text-gray-500">
				Please provide the complete address including city and postal code
			</p>
		</div>

		<!-- Materials Selection -->
		<div>
			<label class="mb-3 block text-sm font-medium text-gray-700">
				Accepted Materials * (Select all that apply)
			</label>
			<div class="grid grid-cols-2 gap-3 md:grid-cols-3">
				{#each availableMaterials as material}
					<label class="flex cursor-pointer items-center space-x-2">
						<input
							type="checkbox"
							checked={materials.includes(material)}
							on:change={() => toggleMaterial(material)}
							class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
						/>
						<span class="text-sm text-gray-700">{material}</span>
					</label>
				{/each}
			</div>
			<p class="mt-2 text-sm text-gray-500">
				Selected: {materials.length > 0 ? materials.join(', ') : 'None selected'}
			</p>
		</div>

		<!-- Notes Field -->
		<div>
			<label for="notes" class="mb-2 block text-sm font-medium text-gray-700">
				Additional Notes (Optional)
			</label>
			<textarea
				id="notes"
				bind:value={notes}
				rows="3"
				placeholder="e.g., Operating hours, special instructions, fees, etc."
				class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
			></textarea>
		</div>

		<!-- Info Box -->
		<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
			<div class="flex items-start">
				<span class="mt-0.5 mr-2 text-blue-500">ℹ️</span>
				<div class="text-sm text-blue-700">
					<p class="mb-1 font-medium">Before you submit:</p>
					<ul class="space-y-1">
						<li>• Make sure this location isn't already on the map</li>
						<li>• Verify the address is correct and complete</li>
						<li>• Double-check which materials are actually accepted</li>
						<li>• Your submission will be reviewed within 24-48 hours</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
			<button
				type="button"
				on:click={handleCancel}
				class="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500/20 focus:outline-none sm:w-auto"
			>
				Cancel
			</button>
			<button
				type="submit"
				disabled={isSubmitting || !name.trim() || !address.trim() || materials.length === 0}
				class="flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
			>
				{#if isSubmitting}
					<svg
						class="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Submitting...
				{:else}
					Submit for Review
				{/if}
			</button>
		</div>
	</form>
</div>
