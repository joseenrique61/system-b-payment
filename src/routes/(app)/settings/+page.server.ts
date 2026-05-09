import { supabase } from '$lib/supabase';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) {
		return { profile: null, methods: [] };
	}

	// Obtener el perfil del usuario desde Postgres
	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', session!.user!.id)
		.single();

	const { data: methods } = await supabase
		.from('payment_methods')
		.select('*')
		.eq('user_id', session!.user!.id);

	return {
		profile: profile || { full_name: '', tax_id: '', city: '', address: '' },
		methods: methods ?? []
	};
};

export const actions = {
    // Acción para guardar los datos personales
    updateProfile: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user?.id) return fail(401);

        const formData = await request.formData();
        const profileData = {
            id: session.user.id,
            full_name: formData.get('fullName'),
            tax_id: formData.get('taxId'),
            city: formData.get('city'),
            address: formData.get('address'),
            updated_at: new Date()
        };

        const { error } = await supabase
            .from('profiles')
            .upsert(profileData); // Upsert inserta o actualiza si ya existe

        if (error) {
            return fail(500, { message: error.message });
        }

        return { success: true };
    },
  
	addCard: async ({ request, locals }) => {
		const session = await locals.auth();
		const formData = await request.formData();

		const cardNumber = formData.get('cardNumber') as string;
		const holderName = formData.get('holderName') as string;

		const { error } = await supabase.from('payment_methods').insert([
			{
				user_id: session!.user!.id,
				holder_name: holderName,
				last_four: cardNumber.slice(-4),
				provider: 'Visa' // Simulado
			}
		]);

		if (error) return fail(500, { message: error.message });
		return { success: true };
	}
};
