import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient.js';
import type { Session, User } from '@supabase/supabase-js';

export const user = writable<User | null>(null);

async function fetchSession() {
	const { data } = await supabase.auth.getSession();
	user.set(data.session?.user ?? null);
}

// Immediately fetch session on store init
fetchSession();

supabase.auth.onAuthStateChange((_event, session: Session | null) => {
	user.set(session?.user ?? null);
});
