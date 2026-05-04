import Crypto from 'crypto-js';
import AES from 'crypto-js/aes';

export async function encrypt(clearText, password = '') {
  if (password.length === 0) {
    return clearText;
  }
  return AES.encrypt(clearText, password).toString();
}

export async function decrypt(cipherText, password = '') {
  if (password.length === 0) {
    return cipherText;
  }
  try {
    return AES.decrypt(cipherText, password).toString(Crypto.enc.Utf8);
  } catch {
    return '?';
  }
}

export async function isBoardEncrypted(board) {
  const encryptionTest = board.data.encryptionTest;
  return encryptionTest && encryptionTest !== 'encryptionTest';
}

export async function checkBoardPassword(board, password) {
  if (!(await isBoardEncrypted(board))) {
    return true;
  }
  const encryptionTest = board.data.encryptionTest;
  const decryptedTest = await decrypt(encryptionTest, password);
  if (decryptedTest === 'encryptionTest') {
    return true;
  }
  return false;
}
