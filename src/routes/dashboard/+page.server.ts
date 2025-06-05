// src/routes/dashboard/+page.server.ts
import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient.js';

export const load = async ({ cookies }) => {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (!session) {
		throw redirect(302, '/');
	}
};
