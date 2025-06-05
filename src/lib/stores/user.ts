import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import { supabase } from '$lib/supabaseClient.js';
import { browser } from '$app/environment';

export const user = writable<User | null>(null);

async function initUser() {
	const { data } = await supabase.auth.getSession();
	user.set(data.session?.user ?? null);
}

if (browser) {
	initUser();
	supabase.auth.onAuthStateChange((_event, session) => {
		user.set(session?.user ?? null);
	});
}
