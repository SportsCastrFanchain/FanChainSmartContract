const FanCoin = artifacts.require('FanCoin');

const { owner, totalSupply } = require('./globals');

contract('FanCoin', accounts => {
  var contractInstance = null;

  before(async () => {
    contractInstance = await FanCoin.new();
  });

  it('contract should be deployed', () =>
    assert(contractInstance));

  it('owner should have entire balance', async () => {
    const balance = await contractInstance.balanceOf(owner);
    assert(balance == totalSupply);
  });

  describe('fields', () => {
    it('should correctly retrieve symbol', async () => {
      const symbol = await contractInstance.symbol();
      assert(symbol);
    });

    it('should correctly retrieve name', async () => {
      const name = await contractInstance.name();
      assert(name);
    });

    it('should correctly retrieve total supply', async () => {
      const supply = await contractInstance.totalSupply();
      assert(supply > 0);
    });

    it('should correctly retrieve decimals', async () => {
      const decimals = await contractInstance.decimals();
      assert(decimals !== undefined && decimals !== null);
    });
  });
});