<script lang="ts">
	import { supabase } from '$lib/supabaseClient.js';

	async function saveUserData(height_cm: number, weight_kg: number) {
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();
		if (userError || !user) {
			console.error('User not logged in or error fetching user:', userError);
			return;
		}

		const { error } = await supabase.from('user_data').upsert({
			user_id: user.id,
			height_cm,
			weight_kg
		});

		if (error) {
			console.error('Error saving data:', error.message);
		} else {
			console.log('User data saved successfully');
		}
	}
</script>

<!-- Your page markup here -->
