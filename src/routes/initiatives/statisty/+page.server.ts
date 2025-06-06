// src/routes/initiatives/statisty/+page.server.ts
import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(301, '/statisty'); // 301: permanent redirect
}
