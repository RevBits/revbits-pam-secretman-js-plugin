import crypto = require('crypto');
import axios = require('axios');

// A constant 'PRIME' is declared with a hexadecimal string value. It is used in a Diffie-Hellman key exchange algorithm for security purposes.
const PRIME =
  'fd589f1a082e0514f1fe342a806d7cef028bfa1d38772428e04d5a7a75a595b444ec7c13936e111d60c9728b75c04bf7f5fdba35608cc9c1c3da5bf436b5c4e1543d73d35e0af905f94befbf488e278711055b293345e885bfa0f98e70ab80633c7a6d380c7f695cc3b653d403f5d8b669bad51b53f37f46f9a11d1aa1f59153';

// A custom error class 'RequiredFieldError' is defined that extends the built-in 'Error' class. It is used to throw an error when a required field is missing. The error object has two properties, 'type' and 'message', to store the error information.
class RequiredFieldError extends Error {
  public type = 'REQUIRED_FIELD';

  constructor(public field: string) {
    super(`${field} is required.`);
    this.message = `${field} is required.`;
  }
}

export async function generateSecret(hostName: string, secretKey: string, apiKey: string) {
  // The 'generateSecret' function is defined which takes three parameters: 'hostName', 'secretKey', and 'apiKey'. Before the main logic, the function checks if any of the three parameters is missing and throws a 'RequiredFieldError' with the missing field name.
  if (!hostName || !secretKey || !apiKey) {
    throw new RequiredFieldError(!hostName ? 'hostName' : !secretKey ? 'secretKey' : 'apiKey');
  }

  // In this block, a Diffie-Hellman key exchange algorithm is being performed. A public key is generated from the 'PRIME' constant.
  const key1 = crypto.createDiffieHellman(Buffer.from(PRIME, 'hex'));
  key1.generateKeys();
  const key1Pub = key1.getPublicKey().toString('hex');

  // Object with settings for API request
  const settings = {
    url: `${hostName}/api/v1/secretman/GetSecretV5/${secretKey}`, // URL for API request
    headers: {
      apiKey, // API key for authentication
      publicKey: key1Pub, // Public key used for encryption
      Accept: 'application/json', // Accept header with JSON format
      'Content-Type': 'application/json', // Content-Type header with JSON format
      'User-Agent': 'ENPAST Client', // User-Agent header with ENPAST Client
    },
  };

  // Setting environment variable for rejecting unauthorized requests
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  // Make API request and destructure response data
  const { data: responseData } = await axios.default.get(settings.url, { headers: settings.headers });

  // Extract initialization vector (IV) from response data
  const IV = responseData.data.substring(0, 32);

  // Compute secret key using Diffie-Hellman key exchange
  const key1key2Secret = key1.computeSecret(Buffer.from(responseData.key, 'hex'));

  // Create decryption object using AES-256-CBC encryption
  const decipher = crypto.createDecipheriv('aes-256-cbc', key1key2Secret.slice(0, 32), Buffer.from(IV, 'hex'));

  // Update decrypted data using decryption object
  let decrypted = decipher.update(Buffer.from(responseData.data.replace(IV, ''), 'hex'));

  // Concatenate decrypted data with decryption object's final output
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // Return decrypted data as a utf-8 string
  return decrypted.toString('utf-8');
};
