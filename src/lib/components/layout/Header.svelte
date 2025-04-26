<script lang="ts">
	import Typography from '$lib/components/Typography.svelte';
	import { slide, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing'; // for a bouncy menu open
	let menuOpen = false;
</script>

<header lang="fr" class="bg-white shadow-md">
	<!-- Top Bar -->
	<div class="w-full bg-[#9d5d2c]">
		<div
			class="flex flex-col items-center justify-between gap-y-2 px-6 py-4 sm:flex-row md:px-12 lg:px-24"
		>
			<a href="/" class="flex items-center space-x-2 text-white">
				<img src="/esprer-logo-transparent.svg" alt="Espérer" class="h-[72px]" />
			</a>
			<Typography variant="small" className="hidden lg:block text-white">
				Mapping a Sustainable Future.
			</Typography>
		</div>
	</div>

	<!-- Navigation -->
	<div class="relative w-full">
		<div class="flex items-center justify-between px-6 py-4 md:px-12 lg:px-24">
			<!-- Left nav -->
			<div class="flex items-center">
				<ul class="hidden space-x-6 text-gray-700 md:flex">
					<li><a href="/about" class="hover:underline">About us</a></li>
					<li><a href="/contact" class="hover:underline">Contact</a></li>
				</ul>
			</div>

			<!-- Right nav -->
			<div class="flex items-center space-x-4">
				<a
					href="/join"
					class="hidden rounded-lg bg-[#9d5d2c] px-4 py-2 text-sm text-white transition hover:bg-[#854822] md:inline-block"
				>
					Get Involved
				</a>
				<!-- Hamburger Button -->
				<button
					class="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border transition-all duration-300 md:hidden"
					on:click={() => (menuOpen = !menuOpen)}
					aria-label="Toggle Menu"
					class:bg-white={!menuOpen}
					class:bg-[#9d5d2c]={menuOpen}
					class:border-gray-400={!menuOpen}
					class:border-[#9d5d2c]={menuOpen}
				>
					<!-- X Bars -->
					<div
						class="relative flex h-6 w-6 flex-col items-center justify-center transition-all duration-500 ease-out"
					>
						<!-- Top Bar -->
						<span
							class="block h-0.5 w-full transition-all duration-500 ease-in-out"
							class:rotate-45={menuOpen}
							class:translate-y-1.5={menuOpen}
							class:bg-white={menuOpen}
							class:bg-gray-700={!menuOpen}
						></span>
						<!-- Middle Bar -->
						<span
							class="my-1 block h-0.5 w-full transition-all duration-500 ease-in-out"
							class:opacity-0={menuOpen}
							class:bg-white={menuOpen}
							class:bg-gray-700={!menuOpen}
						></span>
						<!-- Bottom Bar -->
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

		<!-- Mobile menu -->
		{#if menuOpen}
			<div
				transition:slide|local={{ duration: 500, easing: quintOut }}
				class="absolute top-full right-0 left-0 z-50 flex flex-col items-center gap-6 rounded-b-lg bg-white py-6 shadow-lg"
			>
				<a href="/about" class="text-gray-700 transition hover:text-[#9d5d2c] hover:underline"
					>About us</a
				>
				<a href="/contact" class="text-gray-700 transition hover:text-[#9d5d2c] hover:underline"
					>Contact</a
				>
				<a
					href="/join"
					class="rounded-lg bg-[#9d5d2c] px-4 py-2 text-sm text-white transition hover:bg-[#854822]"
				>
					Get Involved
				</a>
			</div>
		{/if}
	</div>
</header>
