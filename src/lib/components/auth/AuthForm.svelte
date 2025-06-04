<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import Typography from '../Typography.svelte';

	let email = '';
	let password = '';
	let loading = false;
	let error: string | null = null;
	let mode: 'login' | 'register' = 'login';

	async function handleSubmit() {
		loading = true;
		error = null;

		try {
			if (mode === 'register') {
				const { error: signUpError } = await supabase.auth.signUp({
					email,
					password
				});
				if (signUpError) throw signUpError;
			} else {
				const { error: signInError } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (signInError) throw signInError;
			}
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	function toggleMode() {
		mode = mode === 'login' ? 'register' : 'login';
		error = null;
	}
</script>

<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
	<Typography variant="h2" className="mb-6 text-center text-[#9d5d2c]">
		{mode === 'login' ? 'Sign In' : 'Create Account'}
	</Typography>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9d5d2c] focus:ring-[#9d5d2c]"
			/>
		</div>

		<div>
			<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				minlength="6"
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9d5d2c] focus:ring-[#9d5d2c]"
			/>
		</div>

		{#if error}
			<div class="rounded-md bg-red-50 p-4">
				<Typography variant="body" className="text-red-700">{error}</Typography>
			</div>
		{/if}

		<button
			type="submit"
			disabled={loading}
			class="w-full rounded-md bg-[#9d5d2c] px-4 py-2 text-white hover:bg-[#8a4f23] focus:outline-none focus:ring-2 focus:ring-[#9d5d2c] focus:ring-offset-2 disabled:opacity-50"
		>
			{#if loading}
				Processing...
			{:else}
				{mode === 'login' ? 'Sign In' : 'Create Account'}
			{/if}
		</button>

		<button
			type="button"
			on:click={toggleMode}
			class="w-full text-center text-sm text-[#9d5d2c] hover:underline"
		>
			{mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
		</button>
	</form>
</div>