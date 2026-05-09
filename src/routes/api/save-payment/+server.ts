import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST({ request }) {
    const { amount, description, user_id } = await request.json();

    const { data, error } = await supabase
        .from('payments') // Nombre de tu tabla en Supabase
        .insert([
            { 
                amount, 
                description, 
                user_id,
                status: 'completed'
            }
        ]);

    if (error) return json({ error: error.message }, { status: 500 });
    return json({ success: true });
}