# RevBits PAM - Secret Manager JavaScript Plugin 
[![Revits PAM](https://www.revbits.com/image/product/pam/Revbits-Privileged-Access-Management.png)](https://www.revbits.com/products/revbits-privileged-access-management)

RevBits PAM Secret Manager JavaScript Plugin allows you to connect to your RevBits PAM Server and get secret values by connecting to Secretman Service.

## Installation

It requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm i @revbits/pam-secretman-js-plugin
```

## Plugins

This NPM Package uses following packages as well.

| Package | README |
| ------ | ------ |
| CryptoJS | https://www.npmjs.com/package/crypto-js |
| Axios | https://www.npmjs.com/package/axios |

## Functions

| Function | Definition |
| ------ | ------ |
| generateSecret | generateSecretValue(hostName,secretKey,apiKey) |

```
const pamClient=require('@revbits/pam-secretman-js-plugin');
(async function(){
    const secretKey = '<Your Secretman Secret Key here>';
    const apiKey = '<You secretman API Access Key here>';
    const secretValue = await pamClient.generateSecret('https://<Your revbits base url here>',secretKey,apiKey);
})();
```

## License

MIT
