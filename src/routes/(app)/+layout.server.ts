import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals }) => {
	const session = await locals.auth();

	const roles = session?.user?.roles || [];
	if (roles.includes('admin') && url.pathname !== "/admin") {
		throw redirect(303, '/admin');
	}
};
