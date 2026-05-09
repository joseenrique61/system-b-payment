import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals }) => {
  const session = await locals.auth();
  
  if (!session && url.pathname !== "/login") {
    throw redirect(303, "/login");
  }

  return {
    session
  };
};