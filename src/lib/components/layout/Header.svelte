<script lang="ts">
	import Typography from '$lib/components/Typography.svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let menuOpen = false;
	let isMobile = false;

	// Detect screen size
	const checkScreen = () => {
		isMobile = window.innerWidth < 1024; // lg breakpoint
	};

	if (typeof window !== 'undefined') {
		checkScreen();
		window.addEventListener('resize', checkScreen);
	}
</script>

<header class="fixed top-0 right-0 left-0 z-50 border-b border-black bg-white shadow-md">
	<!-- Top Bar -->
	<div class="w-full bg-[#9d5d2c]">
		<div class="flex items-center justify-between px-6 py-4 sm:px-12 lg:px-24">
			<!-- Logo -->
			<a href="/" class="flex items-center">
				<img
					src={isMobile ? '/mobile-logo.svg' : '/esprer-logo-transparent.svg'}
					alt="Espérer"
					class="h-12 sm:h-[72px]"
				/>
			</a>

			<!-- Desktop Links -->
			<div class="hidden items-center space-x-8 text-white lg:flex">
				<a href="/about" class="transition-colors hover:underline">About Us</a>
				<a href="/contact" class="transition-colors hover:underline">Contact</a>
				<a
					href="/join"
					class="rounded-lg border border-[#a09175] bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-[#f5e4d7] hover:text-[#9d5d2c]"
				>
					Get Involved
				</a>
			</div>

			<!-- Mobile Hamburger -->
			<div class="flex items-center lg:hidden">
				<button
					class={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border transition-all duration-300
					${menuOpen ? 'border-[#9d5d2c] bg-[#9d5d2c]' : 'border-gray-400 bg-white'}`}
					on:click={() => (menuOpen = !menuOpen)}
					aria-label="Toggle Menu"
				>
					<div
						class="relative flex h-6 w-6 flex-col items-center justify-center transition-all duration-500 ease-out"
					>
						<span
							class="block h-0.5 w-full transition-all duration-500 ease-in-out"
							class:rotate-45={menuOpen}
							class:translate-y-1.5={menuOpen}
							class:bg-white={menuOpen}
							class:bg-gray-700={!menuOpen}
						></span>
						<span
							class="my-1 block h-0.5 w-full transition-all duration-500 ease-in-out"
							class:opacity-0={menuOpen}
							class:bg-white={menuOpen}
							class:bg-gray-700={!menuOpen}
						></span>
						<span
							class="block h-0.5 w-full transition-all duration-500 ease-in-out"
							class:-rotate-45={menuOpen}
							class:-translate-y-1.5={menuOpen}
							class:bg-white={menuOpen}
							class:bg-gray-700={!menuOpen}
						></span>
					</div>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu -->
	<div class="lg:hidden">
		{#if menuOpen}
			<div
				class="absolute right-0 left-0 z-40 flex flex-col items-center gap-6 bg-white py-6 shadow-lg"
				transition:slide|local={{ duration: 500, easing: quintOut }}
			>
				<a
					href="/about"
					class="text-gray-700 transition-colors hover:text-[#a09175]"
					on:click={() => (menuOpen = false)}>About Us</a
				>
				<a
					href="/contact"
					class="text-gray-700 transition-colors hover:text-[#a09175]"
					on:click={() => (menuOpen = false)}>Contact</a
				>
				<a
					href="/join"
					class="rounded-lg border border-[#a09175] bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-[#a09175] hover:text-white"
					on:click={() => (menuOpen = false)}
				>
					Get Involved
				</a>
			</div>
		{/if}
	</div>
</header>
