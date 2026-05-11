import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    
    // Si no hay sesión, el layout ya redirige, pero por seguridad:
    if (!session?.user?.id) throw error(401, 'No autorizado');

    // Consultar pagos reales de este usuario en Postgres
    const { data: payments, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    if (dbError) throw error(500, dbError.message);

    return {
        payments: payments ?? []
    };
};