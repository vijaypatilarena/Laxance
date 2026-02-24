import crypto from 'crypto';

// AES-256-GCM encryption — military-grade, authenticated encryption.
// The ENCRYPTION_KEY must be a 32-byte (64 hex char) secret in .env.local.
// Even with full database access, data cannot be decrypted without this key.

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;        // 128-bit IV
const TAG_LENGTH = 16;       // 128-bit auth tag

function getKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 64) {
        throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes). Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    }
    return Buffer.from(key, 'hex');
}

/**
 * Encrypts plaintext using AES-256-GCM.
 * Returns a single string: iv:ciphertext:authTag (all hex-encoded).
 * This ensures data integrity AND confidentiality.
 */
export function encrypt(plaintext: string): string {
    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

/**
 * Decrypts a string produced by encrypt().
 * Validates the auth tag to ensure data hasn't been tampered with.
 */
export function decrypt(encryptedData: string): string {
    const key = getKey();
    const [ivHex, ciphertext, authTagHex] = encryptedData.split(':');

    if (!ivHex || !ciphertext || !authTagHex) {
        throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
