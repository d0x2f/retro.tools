import Crypto from 'crypto-js';
import AES from 'crypto-js/aes';

// crypto-js AES output always starts with base64("Salted__") = "U2FsdGVkX1"
const LEGACY_PREFIX = 'U2FsdGVkX1';

async function deriveKey(password, salt, usage) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 200_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    [usage]
  );
}

function toBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromBase64(b64) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export async function encrypt(clearText, password = '') {
  if (password.length === 0) return clearText;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, 'encrypt');
  const enc = new TextEncoder();
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(clearText)
  );
  const combined = new Uint8Array(16 + 12 + cipherBuffer.byteLength);
  combined.set(salt, 0);
  combined.set(iv, 16);
  combined.set(new Uint8Array(cipherBuffer), 28);
  return toBase64(combined.buffer);
}

export async function decrypt(cipherText, password = '') {
  if (password.length === 0) return cipherText;

  // Legacy path: crypto-js AES-CBC (read-only, for boards created before the migration)
  if (cipherText.startsWith(LEGACY_PREFIX)) {
    const result = AES.decrypt(cipherText, password).toString(Crypto.enc.Utf8);
    if (result === '') throw new Error('Decryption failed');
    return result;
  }

  // New path: Web Crypto AES-GCM
  let combined;
  try {
    combined = fromBase64(cipherText);
  } catch {
    throw new Error('Decryption failed');
  }
  if (combined.length < 29) throw new Error('Decryption failed');

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const data = combined.slice(28);
  const key = await deriveKey(password, salt, 'decrypt');

  try {
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    return new TextDecoder().decode(plain);
  } catch {
    throw new Error('Decryption failed');
  }
}

export async function isBoardEncrypted(board) {
  const encryptionTest = board.data.encryptionTest;
  return encryptionTest && encryptionTest !== 'encryptionTest';
}

export async function checkBoardPassword(board, password) {
  if (!(await isBoardEncrypted(board))) return true;
  try {
    const decryptedTest = await decrypt(board.data.encryptionTest, password);
    return decryptedTest === 'encryptionTest';
  } catch {
    return false;
  }
}
