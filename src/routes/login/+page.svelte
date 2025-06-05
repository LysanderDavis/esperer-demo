<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { supabase } from '$lib/supabaseClient.js';
	import { user } from '$lib/stores/user.js';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	let loading = false;
	let email = '';
	let password = '';
	let isSignUp = false;

	// Redirect if already logged in
	onMount(() => {
		if (browser && get(user)) {
			goto('/dashboard');
		}
	});

	const handleEmailLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			goto('/dashboard');
		} catch (error) {
			alert('Email login failed: ' + (error as Error).message);
		} finally {
			loading = false;
		}
	};

	const handleEmailSignup = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signUp({ email, password });
			if (error) throw error;
			alert('Check your email for confirmation.');
		} catch (error) {
			alert('Signup failed: ' + (error as Error).message);
		} finally {
			loading = false;
		}
	};

	const handleGoogleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/dashboard`
				}
			});
			if (error) throw error;
		} catch (error) {
			alert('Google login failed: ' + (error as Error).message);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Login - Espérer</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f5e4d7] to-white px-4 py-8"
>
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-[#9d5d2c]">Welcome to Espérer</h1>
			<p class="text-gray-600">Choose your preferred login method</p>
		</div>

		<!-- Login Card -->
		<div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
			<!-- Google Login Button -->
			<button
				on:click={handleGoogleLogin}
				disabled={loading}
				class="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24">
					<path
						fill="#4285F4"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/>
					<path
						fill="#34A853"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="#FBBC05"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/>
					<path
						fill="#EA4335"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/>
				</svg>
				{loading ? 'Connecting...' : 'Continue with Google'}
			</button>

			<!-- Divider -->
			<div class="relative mb-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-200"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-white px-4 text-gray-500">or</span>
				</div>
			</div>

			<!-- Email Form -->
			<div class="space-y-4">
				<div>
					<label for="email" class="mb-1 block text-sm font-medium text-gray-700"> Email </label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="Enter your email"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors outline-none focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]"
						required
					/>
				</div>

				<div>
					<label for="password" class="mb-1 block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Enter your password"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors outline-none focus:border-[#9d5d2c] focus:ring-2 focus:ring-[#9d5d2c]"
						required
					/>
				</div>

				<button
					on:click={isSignUp ? handleEmailSignup : handleEmailLogin}
					disabled={loading || !email || !password}
					class="w-full rounded-lg bg-[#9d5d2c] px-4 py-2 font-medium text-white transition-colors hover:bg-[#7c451f] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
				</button>
			</div>

			<!-- Toggle Sign Up/Sign In -->
			<div class="mt-6 text-center">
				<button
					on:click={() => (isSignUp = !isSignUp)}
					class="text-sm font-medium text-[#9d5d2c] transition-colors hover:text-[#7c451f]"
				>
					{isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
				</button>
			</div>
		</div>

		<!-- Back to Home -->
		<div class="mt-6 text-center">
			<a href="/" class="text-sm text-gray-500 transition-colors hover:text-[#9d5d2c]">
				← Back to Home
			</a>
		</div>
	</div>
</div>
