// src/lib/stores/statisty.ts
import { writable } from 'svelte/store';

export const metrics = writable({
	bmi: null,
	sleep: null,
	hydration: null,
	nutrition: null,
	carbon: null,
	airQuality: null
});

export const loading = writable({
	bmi: false,
	sleep: false,
	hydration: false,
	nutrition: false,
	carbon: false,
	airQuality: false
});
