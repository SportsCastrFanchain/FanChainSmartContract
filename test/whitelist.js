const FanCoin = artifacts.require('FanCoin');

const { owner, totalSupply, assertAsyncThrows } = require('./globals');

contract('FanCoin', accounts => {
  var contractInstance = null;
  before(async () => {
    contractInstance = await FanCoin.new();
  });

  describe('whitelist', () => {
    it('owner should be able to add', async () => {
      const res = await contractInstance.addToWhitelist(
        accounts[1],
        { from: owner }
      );
      assert(res.tx);
    });

    it('user should not be able to add', async () =>
      assertAsyncThrows(async () =>
        await contractInstance.addToWhitelist(
          accounts[2],
          { from: accounts[3] }
        ),
        /revert/g
      )
    );

    it('owner should be able to remove',  async () => {
      const res = await contractInstance.removeFromWhitelist(
        accounts[1],
        { from: owner }
      );
      assert(res.tx);
    });

    it('user should not be able to remove', async () =>
      assertAsyncThrows(async () =>
        await contractInstance.removeFromWhitelist(
          owner,
          { from: accounts[3] }
        ),
        /revert/g
      )
    );
  });
});