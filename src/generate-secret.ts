import crypto = require('crypto');
import axios = require('axios');

const PRIME =
  'fd589f1a082e0514f1fe342a806d7cef028bfa1d38772428e04d5a7a75a595b444ec7c13936e111d60c9728b75c04bf7f5fdba35608cc9c1c3da5bf436b5c4e1543d73d35e0af905f94befbf488e278711055b293345e885bfa0f98e70ab80633c7a6d380c7f695cc3b653d403f5d8b669bad51b53f37f46f9a11d1aa1f59153';

const RequiredFieldError = class extends Error {
  public type: string;
  public message: string;

  constructor(_field) {
    super(_field);
    this.type = 'REQUIRED_FIELD';
    this.message = `${_field} is required.`;
  }
};

export async function generateSecret(hostName, secretKey, apiKey) {
  if (!hostName || !secretKey || !apiKey) {
    if (!hostName) {
      throw new RequiredFieldError('hostName');
    }
    if (!secretKey) {
      throw new RequiredFieldError('secretKey');
    }
    if (!apiKey) {
      throw new RequiredFieldError('apiKey');
    }
  }

  // Generating public keys
  const key1 = crypto.createDiffieHellman(Buffer.from(PRIME, 'hex'));
  key1.generateKeys();
  const key1Pub = key1.getPublicKey();

  // Preparing Request Options
  const settings = {
    url: `${hostName}/api/v1/secretman/GetSecretV5/${secretKey}`,
    headers: {
      apiKey: apiKey,
      publicKey: key1Pub.toString('hex'),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'ENPAST Jenkins Client',
    },
  };

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  // Request to Secret Manager
  return axios.default.get(settings.url, {
    headers: settings.headers,
  })
    .then((response) => response.data)
    .then((responseData) => {
      const IV = responseData.data.substring(0, 32);
      const key1key2Secret = key1.computeSecret(Buffer.from(responseData.key, 'hex'));
      const decipher = crypto.createDecipheriv('aes-256-cbc', key1key2Secret.slice(0, 32), Buffer.from(IV, 'hex'));
      let decrypted = decipher.update(Buffer.from(responseData.data.replace(IV, ''), 'hex'));
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString('utf-8');
    });
};
