var pamClient = require('../dist/index');
var assert = require('assert');

describe('revbits-pam-azure-plugin', function () {

  it('should throw an error for an undefined value', function() {
    assert.throws(async function() {
        await pamClient.generateSecret(undefined,undefined,undefined);
    });
  });

  it('should throw an error for `null`', function() {
    assert.throws(async function() {
        await pamClient.generateSecret(null,null,null);
    });
  });
});
