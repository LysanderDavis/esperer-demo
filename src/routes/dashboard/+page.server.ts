import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient.js'
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (!session) {
		throw redirect(302, '/');
	}
};
