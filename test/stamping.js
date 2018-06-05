const FanCoin = artifacts.require('FanCoin');

const { owner, totalSupply, assertAsyncThrows } = require('./globals');

contract('FanCoin', accounts => {
  var contractInstance = null;
  before(async () => {
    contractInstance = await FanCoin.new();
  });

  describe('stamping', () => {
    it('initially the owner should have all unstamped tokens', async () => {
      const balance = await contractInstance.balanceOfToken(owner, 0);
      assert(balance == totalSupply);
    });

    it('a token should be stamped correctly', async () => {
      const newStamp = Math.floor(Math.random() * totalSupply) + 1;
      const amount = Math.floor(totalSupply * .10); // 10%

      const stampResult = await contractInstance.stampToken(0, newStamp, amount, {
        from: owner
      });
      assert(stampResult);

      // Make sure they have the correct number of stamped tokens
      const stampedBalance = await contractInstance.balanceOfToken(owner, newStamp);
      assert(stampedBalance == amount);

      // Make sure their total balance is the same
      const totalBalance = await contractInstance.balanceOf(owner);
      assert(totalBalance == totalSupply);

      // Make sure their unstamped balance is correct
      const unstampedBalance = await contractInstance.balanceOfToken(owner, 0);
      assert(unstampedBalance == totalSupply - amount);
    });

    it('should be able to un-stamp token', async () => {
      const stamp = 7777;
      const amt = Math.floor(totalSupply * .10); // 10%
      const unstampedAmt = Math.floor(amt / 2);

      const stampResult = await contractInstance.stampToken(0, stamp, amt, {
        from: owner
      });
      assert(stampResult, 'Unable to stamp the token');

      const unstampResult = await contractInstance.stampToken(stamp, 0, unstampedAmt, {
        from: owner
      });
      assert(unstampResult, 'Unable to un-stamp token');

      const stampedBalance = await contractInstance.balanceOfToken(owner, stamp);
      assert(stampedBalance == amt - unstampedAmt);
    });

    it('should not allow stamps of more than balance', async () =>
      assertAsyncThrows(async () => 
        await contractInstance.stampToken(0, 123, totalSupply + 1, {
          from: owner
        })
      )
    );

    it('a user should not be able to stamp tokens', async () => {
      const newStamp = 1234;
      const amount = 1;

      const transferResult = await contractInstance.transferToken(
        accounts[1],
        0,
        amount,
        { from: owner }
      );
      assert(transferResult, 'The initial transfer result is invalid');

      await assertAsyncThrows(async () =>
        contractInstance.stampToken(0, newStamp, amount, {
          from: accounts[3]
        })
      );
    });

    it('a whitelisted user should be able to stamp tokens', async () => {
      const stamp = 777;
      const amt = 11;
      const from = accounts[3];

      const whitelistResult = await contractInstance.addToWhitelist(from, {
        from: owner
      });
      assert(whitelistResult, 'Unable to whitelist the account');

      const transferResult = await contractInstance.transferToken(
        from,
        0,
        amt,
        { from: owner }
      );
      assert(transferResult, 'The initial transfer result is invalid');

      const stampResult = await contractInstance.stampToken(
        0, stamp, amt, { from }
      );
      assert(stampResult, 'Unable to stamp tokens');

      const stampedBalance = await contractInstance.balanceOfToken(from, stamp);
      assert(stampedBalance == amt);
    });
  });
});