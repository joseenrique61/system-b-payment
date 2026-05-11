import { VAULT_ADDR, VAULT_TOKEN } from '$env/static/private';

const KEY_NAME = 'payments-key';

export const kmsService = {
	/**
	 * ENCRIPTAR (Para enviar confirmación al Sistema A)
	 */
	encrypt: async (payload: object) => {
		const plaintext = JSON.stringify(payload);
		const base64Text = Buffer.from(plaintext).toString('base64');

		const response = await fetch(`${VAULT_ADDR}/v1/transit/encrypt/${KEY_NAME}`, {
			method: 'POST',
			headers: { 'X-Vault-Token': VAULT_TOKEN },
			body: JSON.stringify({ plaintext: base64Text })
		});

		const json = await response.json();
		return json.data.ciphertext;
	},

	decrypt: async (ciphertext: string) => {
		const response = await fetch(`${VAULT_ADDR}/v1/transit/decrypt/${KEY_NAME}`, {
			method: 'POST',
			headers: { 'X-Vault-Token': VAULT_TOKEN },
			body: JSON.stringify({ ciphertext })
		});

		const json = await response.json();
		// Vault devuelve Base64, lo convertimos a texto plano
		const base64Plaintext = json.data.plaintext;
		const base64 = Buffer.from(base64Plaintext, 'base64').toString('utf-8');
		const jsonPayload = JSON.parse(base64);
		return jsonPayload;
	}
};
