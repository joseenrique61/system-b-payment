import { supabase } from '$lib/supabase';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();

    // 1. Verificación de Seguridad (Autorización)
    // Nota: El path exacto del rol depende de tu config de Keycloak
    const roles = session?.user?.roles || [];
    const isAdmin = roles.includes('admin');

    // Si no es admin, lo sacamos
    if (!isAdmin) throw redirect(303, '/dashboard');

    // 2. Cargar todas las transacciones de todos los usuarios
    const { data: allPayments, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

    if (dbError) throw error(500, dbError.message);

    return {
        allPayments: allPayments ?? []
    };
};