import { supabase } from '$lib/supabaseClient.js';

async function test() {
	const { data, error } = await supabase.from('profiles').select('*');
	console.log(data, error);
}

test();
