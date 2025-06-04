import { createServerClient } from '@supabase/ssr';
import type { PageServerLoad } from './$types.js';
import { env } from '$env/dynamic/public';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = createServerClient(env.PUBLIC_SUPABASE_URL!, env.PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) => {
				cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { session };
};
