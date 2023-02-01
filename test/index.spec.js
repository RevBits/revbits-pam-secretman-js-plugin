const expect = require('chai').expect;

const { generateSecret } = require('../dist/generate-secret');

describe('generateSecret', () => {
  it('throws an error if hostName, secretKey, or apiKey is missing', async () => {
    try {
      await generateSecret(null, 'secretKey', 'apiKey');
    } catch (error) {
      expect(error.type).to.equal('REQUIRED_FIELD');
      expect(error.message).to.equal('hostName is required.');
    }

    try {
      await generateSecret('hostName', null, 'apiKey');
    } catch (error) {
      expect(error.type).to.equal('REQUIRED_FIELD');
      expect(error.message).to.equal('secretKey is required.');
    }

    try {
      await generateSecret('hostName', 'secretKey', null);
    } catch (error) {
      expect(error.type).to.equal('REQUIRED_FIELD');
      expect(error.message).to.equal('apiKey is required.');
    }
  });
});
