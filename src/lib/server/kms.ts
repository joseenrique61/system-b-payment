import crypto from 'node:crypto';

// En un entorno real, estas llaves vendrían de un KMS de terceros
const FAKE_KMS_KEY = crypto.scryptSync('mi-password-secreto', 'salt', 32);
const IV = crypto.randomBytes(16);

export const kmsService = {
    // Simula encriptación (Lo usaría el Sistema A)
    encrypt: async (text: string) => {
        const cipher = crypto.createCipheriv('aes-256-cbc', FAKE_KMS_KEY, IV);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    },
    // Simula desencriptación (Lo usa el Sistema B - este portal)
    decrypt: async (encryptedText: string) => {
        const decipher = crypto.createDecipheriv('aes-256-cbc', FAKE_KMS_KEY, IV);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};