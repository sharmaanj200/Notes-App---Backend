const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPT_RF_KEY,'hex'); 
const iv = Buffer.from(process.env.ENCRYPT_RF_IV, 'hex');

const encryptRefreshToken = (token) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

const decryptRefreshToken = (token) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(token, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
    encryptRefreshToken,
    decryptRefreshToken
};
