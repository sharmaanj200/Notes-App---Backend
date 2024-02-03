const crypto = require('crypto');

const generateRandomBytes = (bitSize) => {
  return crypto.randomBytes(bitSize);
}

console.log(`REFRESH_TOKEN_SECRET=${generateRandomBytes(16).toString('hex')}`);
console.log(`ENCRYPT_RF_IV=${generateRandomBytes(16).toString('hex')}`);


const algorithm = 'aes-256-cbc';
const salt = crypto.randomBytes(16);
const keyLength = 32; // 256 bits
const password = 'Dcs<0K"xPzM5ETo';

const generateKey = (password, salt, keyLength) => {
  return crypto.pbkdf2Sync(password, salt, 100000, keyLength, 'sha512');
};

// Generate encryption key
const key = generateKey(password, salt, keyLength);
console.log(`ENCRYPT_RF_KEY=${key.toString('hex')}`);