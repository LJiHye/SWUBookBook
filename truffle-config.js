var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "";

module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 8545,
               network_id: "*" // Match any network id
          },
          ropsten: {
              provider: function() {
                  return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/apikey')
              },
              network_id: '3',
              gas: 4500000,
              gasPrice: 10000000000,
          }
     }
};
