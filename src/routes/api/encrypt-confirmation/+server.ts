import { kmsService } from '$lib/server/kms.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const confirmationPayload = await request.json();

  const token = encodeURIComponent(await kmsService.encrypt(confirmationPayload));

	return json({ token: token });
}