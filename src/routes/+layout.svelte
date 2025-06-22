<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	// Initialize app on mount
	onMount(() => {
		if (browser) {
			// Add any global initialization here
			console.log('🌱 Veggie app initialized');
		}
	});
</script>

<!-- Global styles and layout -->
<Header />
<main class="min-h-screen">
	<slot />
</main>
<Footer />

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		font-family:
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			'Helvetica Neue',
			Arial,
			'Noto Sans',
			sans-serif;
	}

	/* Custom scrollbar for webkit browsers */
	:global(::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: #f1f5f9;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: #cbd5e1;
		border-radius: 4px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: #94a3b8;
	}

	/* Line clamp utility for older browsers */
	:global(.line-clamp-2) {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Focus styles */
	:global(.focus\:ring-green-500:focus) {
		box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
	}

	/* Transition utilities */
	:global(.transition-colors) {
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	:global(.transition-shadow) {
		transition-property: box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	:global(.transition-all) {
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	/* Loading spinner animation */
	:global(.animate-spin) {
		animation: spin 1s linear infinite;
	}

	:global(.animate-pulse) {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Custom utilities for the app */
	:global(.shadow-lg) {
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	:global(.shadow-md) {
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	/* Ring utilities for focus states */
	:global(.ring-2) {
		box-shadow: 0 0 0 2px currentColor;
	}

	/* Ensure proper spacing and layout */
	:global(.space-y-4 > :not([hidden]) ~ :not([hidden])) {
		margin-top: 1rem;
	}

	:global(.space-y-6 > :not([hidden]) ~ :not([hidden])) {
		margin-top: 1.5rem;
	}

	/* Grid utilities */
	:global(.grid-cols-1) {
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}

	@media (min-width: 768px) {
		:global(.md\:grid-cols-2) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		:global(.md\:flex) {
			display: flex;
		}
	}

	@media (min-width: 1024px) {
		:global(.lg\:grid-cols-3) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	/* Gap utilities */
	:global(.gap-1) {
		gap: 0.25rem;
	}
	:global(.gap-2) {
		gap: 0.5rem;
	}
	:global(.gap-4) {
		gap: 1rem;
	}
	:global(.gap-6) {
		gap: 1.5rem;
	}
</style>
