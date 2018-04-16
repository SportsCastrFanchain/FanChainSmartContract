const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const web3 = new Web3();

const mnemonic = process.env.MNEMONIC;

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: 'localhost',
      port: 9545,
      network_id: '*',
      gas: 4712388
    },
    ropsten: {
      network_id: 3,
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/YOUR_API_KEY_HERE");
      },
      gas: 4e6,
      gasPrice: 2e10
    },
    live: {
      network_id: 1,
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/YOUR_API_KEY_HERE");
      },
      gas: 4e6,
      // gas: 7972756
      gasPrice: web3.toWei('2', 'gwei'),
    }
  }
};
