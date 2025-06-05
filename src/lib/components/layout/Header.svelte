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
	let userDropdownOpen = false;

	const handleLogin = () => {
		goto('/login');
	};

	const handleLogout = async (): Promise<void> => {
		try {
			loading = true;
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			goto('/');
		} catch (error) {
			alert('Logout failed: ' + (error as Error).message);
		} finally {
			loading = false;
		}
	};

	const handleSettings = () => {
		goto('/settings');
		userDropdownOpen = false;
	};

	const checkScreen = (): void => {
		if (browser) {
			isMobile = window.innerWidth < 1080;
		}
	};

	// Close dropdown when clicking outside
	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest('.user-dropdown-container')) {
			userDropdownOpen = false;
		}
	};

	// Get user initials for avatar
	const getUserInitials = (user: any): string => {
		if (!user) return 'U';
		const name = user.user_metadata?.full_name || user.email || 'User';
		const initials = name
			.split(' ')
			.map((n: string) => n[0])
			.join('')
			.substring(0, 2);
		return initials.toUpperCase();
	};

	onMount(() => {
		checkScreen();
		window.addEventListener('resize', checkScreen);
		window.addEventListener('click', handleClickOutside);
		return () => {
			window.removeEventListener('resize', checkScreen);
			window.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<header class="fixed top-0 right-0 left-0 z-50 border-b border-[#111111ae] bg-white shadow-md">
	<div class="w-full bg-[#9d5d2c]">
		<div class="flex items-center justify-between px-6 py-4 sm:px-12 lg:px-24">
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

			<!-- Desktop Nav -->
			<div class="hidden items-center space-x-8 text-white lg:flex">
				<a href="/about" class="transition-colors hover:underline">About</a>
				<a href="/global-impact" class="transition-colors hover:underline">Global Impact</a>
				<a href="/initiatives" class="transition-colors hover:underline">Initiatives</a>
				<a href="mailto:esperer8@substack.com" class="transition-colors hover:underline">Contact</a>

				{#if $user}
					<!-- User Avatar Dropdown -->
					<div class="user-dropdown-container relative">
						<button
							on:click={() => (userDropdownOpen = !userDropdownOpen)}
							class="focus:ring-opacity-50 flex h-10 w-10 items-center justify-center rounded-full bg-white font-semibold text-[#9d5d2c] shadow-md transition-all hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
							aria-label="User menu"
							aria-expanded={userDropdownOpen}
						>
							{getUserInitials($user)}
						</button>

						{#if userDropdownOpen}
							<div
								class="absolute right-0 z-50 mt-2 w-[20rem] rounded-lg border border-gray-200 bg-white py-2 shadow-xl"
								transition:slide|local={{ duration: 200, easing: quintOut }}
							>
								<div class="border-b border-gray-100 px-4 py-2">
									<p class="text-sm font-medium text-gray-900">
										{$user.user_metadata?.full_name || 'User'}
									</p>
									<p class="text-xs text-gray-500">{$user.email}</p>
								</div>

								<button
									on:click={handleSettings}
									class="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#9d5d2c]"
								>
									<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										></path>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										></path>
									</svg>
									Settings
								</button>

								<button
									on:click={() => {
										handleLogout();
										userDropdownOpen = false;
									}}
									disabled={loading}
									class="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										></path>
									</svg>
									{loading ? 'Logging out...' : 'Logout'}
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<button
						on:click={handleLogin}
						class="rounded-lg bg-[#b96b30] px-5 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#7c451f] focus:ring-2 focus:ring-[#c38b5f] focus:outline-none"
					>
						Login
					</button>
				{/if}
			</div>

			<!-- Mobile Menu Toggle -->
			<div class="flex items-center lg:hidden">
				{#if $user}
					<!-- Mobile User Avatar -->
					<div class="user-dropdown-container relative mr-4">
						<button
							on:click={() => (userDropdownOpen = !userDropdownOpen)}
							class="focus:ring-opacity-50 flex h-10 w-10 items-center justify-center rounded-full bg-white font-semibold text-[#9d5d2c] shadow-md transition-all hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
							aria-label="User menu"
							aria-expanded={userDropdownOpen}
						>
							{getUserInitials($user)}
						</button>

						{#if userDropdownOpen}
							<div
								class="absolute right-0 z-50 mt-2 w-[20rem] rounded-lg border border-gray-200 bg-white py-2 shadow-xl"
								transition:slide|local={{ duration: 200, easing: quintOut }}
							>
								<div class="border-b border-gray-100 px-4 py-2">
									<p class="text-sm font-medium text-gray-900">
										{$user.user_metadata?.full_name || 'User'}
									</p>
									<p class="text-xs text-gray-500">{$user.email}</p>
								</div>

								<button
									on:click={handleSettings}
									class="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#9d5d2c]"
								>
									<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										></path>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										></path>
									</svg>
									Settings
								</button>

								<button
									on:click={() => {
										handleLogout();
										userDropdownOpen = false;
									}}
									disabled={loading}
									class="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										></path>
									</svg>
									{loading ? 'Logging out...' : 'Logout'}
								</button>
							</div>
						{/if}
					</div>
				{/if}

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

	<!-- Mobile Nav -->
	<div class="lg:hidden">
		{#if menuOpen}
			<div
				class="absolute right-0 z-50 mt-2 w-[20rem] rounded-lg border border-gray-200 bg-white py-2 shadow-xl"
				transition:slide|local={{ duration: 500, easing: quintOut }}
			>
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

				<div class="flex w-full flex-col items-center gap-3 pt-4">
					<a
						href="/join"
						class="rounded-lg border border-[#a09175] bg-white px-6 py-2 text-sm text-black transition-colors hover:bg-[#a09175] hover:text-white focus:ring-2 focus:ring-[#9d5d2c] focus:outline-none"
						on:click={() => (menuOpen = false)}
					>
						Get Involved
					</a>

					{#if !$user}
						<button
							on:click={() => {
								handleLogin();
								menuOpen = false;
							}}
							class="rounded-lg border border-[#a09175] bg-white px-6 py-2 text-sm text-black transition-colors hover:bg-[#f5e4d7] hover:text-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c] focus:outline-none"
						>
							Login
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</header>
