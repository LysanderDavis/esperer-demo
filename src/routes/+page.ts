import { supabase } from '$lib/supabaseClient.js';

async function test() {
	const { data, error } = await supabase.from('some_table').select('*');
	console.log(data, error);
}

test();
