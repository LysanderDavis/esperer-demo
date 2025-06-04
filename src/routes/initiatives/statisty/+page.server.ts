import { createServerClient } from '@supabase/auth-helpers-sveltekit/server';
import type { PageServerLoad } from './$types';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ cookies, request }) => {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies,
		request
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { session };
};
