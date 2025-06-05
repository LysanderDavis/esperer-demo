<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { supabase } from '$lib/supabaseClient.js';
	import { user } from '$lib/stores/user.js';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let menuOpen = false;
	let isMobile = false;
	let loading = false;

	// 🧠 Login with GitHub OAuth
	const handleLogin = async (): Promise<void> => {
		try {
			loading = true;
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/dashboard`
				}
			});
			if (error) throw error;
			// No need to set user here, listener will update user store automatically
		} catch (error) {
			if (error instanceof Error) {
				alert('Login failed: ' + error.message);
			} else {
				alert('Login failed: Unknown error');
			}
		} finally {
			loading = false;
		}
	};

	// 🧼 Logout
	const handleLogout = async (): Promise<void> => {
		try {
			loading = true;
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			// Redirect to home after logout
			window.location.href = '/';
		} catch (error) {
			if (error instanceof Error) {
				alert('Logout failed: ' + error.message);
			} else {
				alert('Logout failed: Unknown error');
			}
		} finally {
			loading = false;
		}
	};

	// 📱 Responsive screen check (SSR safe)
	const checkScreen = (): void => {
		if (browser) {
			isMobile = window.innerWidth < 1080;
		}
	};

	onMount(() => {
		checkScreen();
		window.addEventListener('resize', checkScreen);
		return () => window.removeEventListener('resize', checkScreen);
	});
</script>

<header class="fixed top-0 right-0 left-0 z-50 border-b border-[#111111ae] bg-white shadow-md">
	<!-- Top Bar -->
	<div class="w-full bg-[#9d5d2c]">
		<div class="flex items-center justify-between px-6 py-4 sm:px-12 lg:px-24">
			<!-- Logo -->
			<a
				href="/"
				class="flex items-center"
				on:click={() => (document.title = 'Espérer')}
				aria-label="Espérer Home"
			>
				<img
					src={isMobile ? '/mobile-logo.svg' : '/esperer-logo-transparent.svg'}
					alt="Espérer logo"
					class="h-12 sm:h-[72px]"
				/>
			</a>

			<!-- Desktop Links -->
			<div class="hidden items-center space-x-8 text-white lg:flex">
				<a href="/about" class="transition-colors hover:underline">About</a>
				<a href="/global-impact" class="transition-colors hover:underline">Global Impact</a>
				<a href="/initiatives" class="transition-colors hover:underline">Initiatives</a>
				<a href="mailto:esperer8@substack.com" class="transition-colors hover:underline">Contact</a>

				{#if $user}
					<!-- Logged in: Show only Logout -->
					<button
						on:click={handleLogout}
						class="rounded-lg border border-white px-4 py-2 text-sm text-white transition-all hover:border-gray-700 hover:text-black focus:ring-2 focus:ring-gray-300 focus:outline-none"
					>
						Logout
					</button>
				{:else}
					<!-- Not logged in: Show Get Involved linking to /join -->
					<button
						on:click={handleLogin}
						class="rounded-lg bg-[#b96b30] px-5 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#7c451f] focus:ring-2 focus:ring-[#c38b5f] focus:outline-none"
					>
						Login
					</button>
				{/if}
			</div>

			<!-- Mobile Hamburger -->
			<div class="flex items-center lg:hidden">
				<button
					type="button"
					aria-label="Toggle Menu"
					aria-expanded={menuOpen}
					on:click={() => (menuOpen = !menuOpen)}
					class={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border transition-all duration-300 focus:outline-none
						${menuOpen ? 'border-[#9d5d2c] bg-[#9d5d2c]' : 'border-gray-400 bg-white'}`}
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
				class="absolute right-0 left-0 z-40 flex flex-col items-center gap-4 bg-white py-6 shadow-lg"
				transition:slide|local={{ duration: 500, easing: quintOut }}
			>
				<!-- Nav Links -->
				<a
					href="/about"
					class="text-gray-700 transition-colors hover:text-[#a09175]"
					on:click={() => (menuOpen = false)}>About</a
				>
				<a
					href="/global-impact"
					class="text-gray-700 transition-colors hover:text-[#a09175]"
					on:click={() => (menuOpen = false)}>Global Impact</a
				>
				<a
					href="/initiatives"
					class="text-gray-700 transition-colors hover:text-[#a09175]"
					on:click={() => (menuOpen = false)}>Initiatives</a
				>
				<a
					href="mailto:esperer8@substack.com"
					class="text-gray-700 transition-colors hover:text-[#a09175]"
					on:click={() => (menuOpen = false)}>Contact</a
				>

				<!-- CTA Buttons container -->
				<div class="flex w-full flex-col items-center gap-3 pt-4">
					<!-- Smaller width buttons with thinner borders -->
					<a
						href="/join"
						class="rounded-lg border border-[#a09175] bg-white px-6 py-2 text-sm text-black transition-colors hover:bg-[#a09175] hover:text-white focus:ring-2 focus:ring-[#9d5d2c] focus:outline-none"
						on:click={() => (menuOpen = false)}
					>
						Get Involved
					</a>

					{#if $user}
						<button
							on:click={() => {
								handleLogout();
								menuOpen = false;
							}}
							disabled={loading}
							class="rounded-lg border border-[#a09175] bg-white px-6 py-2 text-sm text-black transition-colors hover:bg-[#f5e4d7] hover:text-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
						>
							{loading ? 'Logging out...' : 'Logout'}
						</button>
					{:else}
						<button
							on:click={() => {
								handleLogin();
								menuOpen = false;
							}}
							disabled={loading}
							class="rounded-lg border border-[#a09175] bg-white px-6 py-2 text-sm text-black transition-colors hover:bg-[#f5e4d7] hover:text-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
						>
							{loading ? 'Logging in...' : 'Login'}
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</header>
