<!-- src/routes/+error.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Typography from '$lib/components/Typography.svelte';

	// Get error status from page store
	$: status = $page.status || 404;
	$: message = $page.error?.message || 'Page not found';

	// Navigation suggestions based on your site structure
	const suggestions = [
		{ name: 'Home', href: '/', description: 'Return to our homepage' },
		{ name: 'About Us', href: '/about', description: 'Learn about our mission' },
		{ name: 'Six Pillars', href: '/six-pillars', description: 'Discover our core values' },
		{ name: 'Global Impact', href: '/global-impact', description: 'See our worldwide work' },
		{ name: 'Our Journal', href: '/our-journal', description: 'Read our latest articles' }
	];

	// Handle search functionality
	let searchQuery = '';

	const handleSearch = () => {
		if (searchQuery.trim()) {
			// You can customize this to redirect to your search page
			goto(`/?search=${encodeURIComponent(searchQuery.trim())}`);
		}
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			handleSearch();
		}
	};
</script>

<svelte:head>
	<title>{status} - Page Not Found | Espérer</title>
	<meta
		name="description"
		content="The page you're looking for couldn't be found. Explore our mission to inspire hope and create positive change."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-[#f9f7f4] to-[#f5e4d7] pt-24">
	<div class="mx-auto max-w-4xl px-6 py-16 sm:px-12 lg:px-24">
		<!-- Error Status -->
		<div class="text-center">
			<div class="mb-8">
				<span class="text-[12rem] font-bold text-[#9d5d2c] opacity-20 sm:text-[16rem]">
					{status}
				</span>
			</div>

			<!-- Main Heading -->
			<div class="mb-6">
				<Typography variant="h1" className="text-[#9d5d2c] mb-4">
					{#if status === 404}
						Lost in Hope?
					{:else}
						Something Went Wrong
					{/if}
				</Typography>
				<Typography variant="body" className="text-gray-600 text-lg max-w-2xl mx-auto">
					{#if status === 404}
						The page you're looking for seems to have wandered off on its own journey. But don't
						worry – every path can lead to something meaningful.
					{:else}
						We encountered an unexpected issue, but like all challenges, this too can be overcome.
					{/if}
				</Typography>
			</div>

			<!-- Inspirational Quote -->
			<div
				class="mb-12 rounded-xl border border-[#9d5d2c]/20 bg-white/60 p-8 shadow-lg backdrop-blur-sm"
			>
				<blockquote class="text-center">
					<Typography variant="body" className="text-[#9d5d2c] text-xl italic mb-4">
						"Hope is the thing with feathers that perches in the soul and sings the tune without the
						words and never stops at all."
					</Typography>
					<Typography variant="small" className="text-gray-500">— Emily Dickinson</Typography>
				</blockquote>
			</div>

			<!-- Search Bar -->
			<div class="mb-12">
				<Typography variant="h3" className="text-gray-700 mb-4">
					Looking for something specific?
				</Typography>
				<div class="mx-auto flex max-w-md">
					<input
						type="text"
						bind:value={searchQuery}
						on:keypress={handleKeyPress}
						placeholder="Search our site..."
						class="flex-1 rounded-l-lg border border-[#9d5d2c]/30 bg-white px-4 py-3 text-gray-700 focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]/20 focus:outline-none"
					/>
					<button
						on:click={handleSearch}
						class="rounded-r-lg bg-[#9d5d2c] px-6 py-3 text-white transition-colors hover:bg-[#8a4f23] focus:ring-2 focus:ring-[#9d5d2c]/50 focus:outline-none"
					>
						Search
					</button>
				</div>
			</div>

			<!-- Navigation Suggestions -->
			<div class="mb-12">
				<Typography variant="h3" className="text-gray-700 mb-8">
					Or explore these meaningful paths:
				</Typography>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each suggestions as { name, href, description }}
						<a
							{href}
							class="group rounded-xl border border-[#9d5d2c]/20 bg-white/80 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl"
						>
							<Typography variant="h3" className="text-[#9d5d2c] mb-2 group-hover:text-[#8a4f23]">
								{name}
							</Typography>
							<Typography variant="small" className="text-gray-600">
								{description}
							</Typography>
						</a>
					{/each}
				</div>
			</div>

			<!-- Call to Action -->
			<div class="rounded-xl bg-[#9d5d2c] p-8 text-white shadow-xl">
				<Typography variant="h2" className="text-white mb-4">Join Our Mission of Hope</Typography>
				<Typography variant="body" className="text-white/90 mb-6 max-w-2xl mx-auto">
					While you're here, why not become part of our community? Together, we can create positive
					change and inspire hope around the world.
				</Typography>
				<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
					<a
						href="/join"
						class="rounded-lg bg-white px-8 py-3 font-semibold text-[#9d5d2c] transition-colors hover:bg-[#f5e4d7] hover:text-[#8a4f23]"
					>
						Get Involved
					</a>
					<a
						href="/about"
						class="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-[#9d5d2c]"
					>
						Learn More
					</a>
				</div>
			</div>

			<!-- Back Button -->
			<div class="mt-12">
				<button
					on:click={() => history.back()}
					class="inline-flex items-center gap-2 text-[#9d5d2c] transition-colors hover:text-[#8a4f23]"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Go Back
				</button>
			</div>
		</div>
	</div>
</main>
