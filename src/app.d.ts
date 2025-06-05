// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
/// <reference types="@sveltejs/kit" />

// src/app.d.ts
import type { Session } from '@supabase/supabase-js';

declare namespace App {
	interface Locals {
		session?: Session | null;
	}
}

export {};
