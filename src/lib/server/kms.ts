import { VAULT_ADDR, VAULT_TOKEN } from "$env/static/private";

const KEY_NAME = 'payments-key';

export const kmsService = {
    decrypt: async (ciphertext: string) => {
        const response = await fetch(`${VAULT_ADDR}/v1/transit/decrypt/${KEY_NAME}`, {
            method: 'POST',
            headers: { 'X-Vault-Token': VAULT_TOKEN },
            body: JSON.stringify({ ciphertext })
        });

        const json = await response.json();
        // Vault devuelve Base64, lo convertimos a texto plano
        console.log(json)
        const base64Plaintext = json.data.plaintext;
        const base64 = Buffer.from(base64Plaintext, 'base64').toString('utf-8');
        const jsonPayload = JSON.parse(base64);
        return jsonPayload;
    }
};