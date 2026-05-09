import { kmsService } from '$lib/server/kms';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const encryptedToken = url.searchParams.get('payload');
    
    // Si no hay token, simulamos uno para desarrollo, 
    // pero en producción el Sistema A debe enviarlo.
    let paymentData = { amount: 0, orderId: 'N/A' };

    if (encryptedToken) {
        const decrypted = await kmsService.decrypt(encryptedToken);
        paymentData = JSON.parse(decrypted);
    } else {
        paymentData = { amount: 125.50, orderId: 'FERRE-552' };
    }

    return { paymentData };
};