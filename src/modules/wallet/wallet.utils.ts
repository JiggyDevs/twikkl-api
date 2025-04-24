import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc'; // Using AES-256 in CBC mode
const IV_LENGTH = 16; // AES block size in bytes

function getEncryptionKey(): string {
  return process.env.ENCRYPTION_KEY || 'defaultsecretkeydefaultsecretkey';
}

/**
 * Encrypts the given text using AES-256-CBC.
 * Returns a string in the format "ivHex:ciphertextHex".
 */
export function encryptData(text: string): string {
  if (!text) {
    throw new Error('Text to encrypt must be provided');
  }

  // Generate a random Initialization Vector (IV)
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create a key Buffer.
  // Here, we hash the key to ensure it is exactly 32 bytes.
  const key = crypto
    .createHash('sha256')
    .update(getEncryptionKey(), 'utf8')
    .digest();

  // Create the cipher instance and encrypt the text.
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return the IV and the ciphertext, concatenated with a colon.
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptData(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(':')) {
    throw new Error(
      "Encrypted text must be in the format 'ivHex:ciphertextHex'",
    );
  }

  // Split the input into the IV and the encrypted data.
  const [ivHex, encryptedDataHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');

  // Recreate the key in the same way.
  const key = crypto
    .createHash('sha256')
    .update(getEncryptionKey(), 'utf8')
    .digest();

  // Create the decipher instance and decrypt the text.
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedDataHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  if (!decrypted) {
    throw new Error(
      'Failed to decrypt text. The provided key may be incorrect.',
    );
  }

  return decrypted;
}
