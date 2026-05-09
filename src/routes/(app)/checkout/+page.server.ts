import { kmsService } from '$lib/server/kms';
import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
    const session = await locals.auth();
    if (!session) throw error(401, 'Debes iniciar sesión para pagar');

    // 1. Obtener datos de la compra (Desencriptar con KMS)
    const encryptedToken = url.searchParams.get('token');
    let paymentData = { amount: 0, orderId: 'N/A', store: 'Ferretería' };

    if (encryptedToken) {
        const payload = await kmsService.decrypt(encryptedToken);
        paymentData = payload;
    }

    // 2. Obtener Perfil de Facturación desde Supabase
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session!.user!.id)
        .single();

    // 3. Obtener Métodos de Pago desde Supabase
    const { data: methods } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', session!.user!.id);

    return {
        paymentData,
        profile: profile || {},
        methods: methods || []
    };
};