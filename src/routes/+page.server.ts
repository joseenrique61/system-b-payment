import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();

	// 1. Verificación de Seguridad (Autorización)
	// Nota: El path exacto del rol depende de tu config de Keycloak
	const roles = session?.user?.roles || [];
	const isAdmin = roles.includes('admin');

	if (!isAdmin) throw redirect(303, '/dashboard');

	throw redirect(303, '/admin');
};
