const FanCoin = artifacts.require('FanCoin');

const { owner, totalSupply, assertAsyncThrows } = require('./globals');

contract('FanCoin', accounts => {
  describe('transferToken', () => {
    var contractInstance = null;
    beforeEach(async () => {
      contractInstance = await FanCoin.new();
    });

    it('should be able to transfer unstamped token', async () => {
      const amt = Math.floor(totalSupply * .01); // 1%
      const to = accounts[1];
      const transferResult = await contractInstance.transferToken(to, 0, amt, {
        from: owner
      });
      assert(transferResult);

      await verifyBalance(contractInstance, owner, 0, totalSupply - amt);
      await verifyBalance(contractInstance, to, 0, amt);
    });

    it('should be able to transfer stamped token', async () => {
      const amt = Math.floor(totalSupply * .01); // 1%
      const to = accounts[1];
      const token = 1234;
      const stampResult = await contractInstance.stampToken(owner, 0, token, amt, {
        from: owner
      });
      assert(stampResult, 'Unable to stamp tokens');

      const transferResult = await contractInstance.transferToken(to, token, amt, {
        from: owner
      });
      assert(transferResult, 'Unable to transfer tokens');

      await verifyBalance(contractInstance, owner, token, 0, totalSupply - amt);
      await verifyBalance(contractInstance, to, token, amt);
    });

    it('user should be able to transfer', async () => {
      const stampAmt = Math.floor(totalSupply * .05); // 5%
      const userAmt = Math.floor(stampAmt / 2);
      const user = accounts[1];
      const final = accounts[2];
      const token = 7777;

      const stampResult = await contractInstance.stampToken(owner, 0, token, stampAmt, {
        from: owner
      });
      assert(stampResult, 'Unable to stamp tokens');

      const transferResult = await contractInstance.transferToken(user, token, userAmt, {
        from: owner
      });
      assert(transferResult, 'Unable to transfer tokens to user');

      const userTransferResult = await contractInstance.transferToken(final, token, userAmt, {
        from: user
      });
      assert(userTransferResult, 'Unable to transfer tokens from user to another user');

      await verifyBalance(contractInstance, owner, token, stampAmt - userAmt,
        totalSupply - userAmt);
      await verifyBalance(contractInstance, user, token, 0);
      await verifyBalance(contractInstance, final, token, userAmt);
    });

    it('user should not be able to transfer unowned funds', async () =>
      assertAsyncThrows(async () =>
        contractInstance.transferToken(accounts[1], 0, 1, {
          from: accounts[2]
        })
      )
    );

    it('user should not be able to transfer negative amounts', async () => {
      const to = accounts[1];
      const transferResult = await contractInstance.transferToken(to, 0, 1, {
        from: owner
      });
      assert(transferResult, 'Unable to do initial transfer');

      await assertAsyncThrows(async () =>
        contractInstance.transferResult(accounts[1], 0, -1, {
          from: to
        })
      );
    });

    it('user should not be able to transfer more than is owned', async () => {
      const to = accounts[1];
      const amt = 1;
      const transferResult = await contractInstance.transferToken(to, 0, amt, {
        from: owner
      });
      assert(transferResult, 'Unable to do initial transfer');

      await assertAsyncThrows(async () =>
        contractInstance.transferResult(accounts[1], 0, amt + 1, {
          from: to
        })
      );
    });
  });

  describe('transferTokens', () => {
    var contractInstance = null;
    beforeEach(async () => {
      contractInstance = await FanCoin.new();
    });

    it('should be able to transfer a combination of tokens', async () => {
      const token = 7777;
      const amt = Math.floor(totalSupply * .01);
      const amtStamped = amt;
      const to = accounts[1];

      const stampResult = await contractInstance.stampToken(owner, 0, token, amtStamped, {
        from: owner
      });
      assert(stampResult, 'Unable to stamp tokens');

      const transferResult = await contractInstance.transferTokens(
        to, [0, token], [amt, amtStamped], { from: owner }
      );
      assert(transferResult, 'Unable to transfer tokens');

      await verifyBalance(contractInstance, owner, token, 0, totalSupply - (amt + amtStamped));
      await verifyBalance(contractInstance, to, token, amtStamped, amt + amtStamped);
    });

    it('should not be able to transfer unowned funds', async () => {
      const to = accounts[9];
      const amt = totalSupply * 0.001;
      const token = 12345;

      assertAsyncThrows(async () => 
        contractInstance.transferTokens(
          to, [token], [1], {
          from: accounts[8]
        })
      );
    });

    it('should not be able to transfer negative amounts', async () => {
      const to = accounts[9];

      await assertAsyncThrows(async () => 
        contractInstance.transferTokens(to, [0], [-1], {
          from: accounts[8]
        })
      );
    });

    it('should not be able to transfer more than is owned', async () => {
      const to = accounts[9];
      const amt = totalSupply;

      await assertAsyncThrows(async () => 
        contractInstance.transferTokens(to, [0], [amt + 1], {
          from: accounts[8]
        })
      );
    });
  });

  describe('transfer', () => {
    var contractInstance = null;
    beforeEach(async () => {
      contractInstance = await FanCoin.new();
    });

    it('should be able to transfer unstamped', async () => {
      const amt = Math.floor(totalSupply * .01);
      const to = accounts[1];

      const transferResult = await contractInstance.transfer(to, amt, {
        from: owner
      });
      assert(transferResult, 'Unable to transfer tokens');

      await verifyBalance(contractInstance, owner, 0, totalSupply - amt);
      await verifyBalance(contractInstance, to, 0, amt);
    });

    it('should be able to transfer unstamped and stamped', async () => {
      // We stamp 60% of tokens, and transfer 100%. This makes it easy
      // to verify the balances
      const percentStamped = .6;
      const amtStamped = Math.floor(totalSupply * percentStamped);
      const amt = totalSupply;
      const stamp = 1337;
      const to = accounts[3];

      const stampResult = await contractInstance.stampToken(owner, 0, stamp, amtStamped, {
        from: owner
      });
      assert(stampResult, 'Unable to stamp tokens');

      const transferResult = await contractInstance.transfer(to, amt, {
        from: owner
      });
      assert(transferResult, 'Unable to transfer tokens');

      await verifyBalance(contractInstance, owner, stamp, 0);
      await verifyBalance(contractInstance, to, stamp, amtStamped, amt);
    });
  });

  describe('transfer (ERC20)', () => {
    const amt = Math.floor(totalSupply * .01);
    const tokens = [7777, 8888, 9999];
    let contractInstance = null;
    beforeEach(async () => {
      contractInstance = await FanCoin.new();

      await Promise.all(tokens.map(async token => {
        const stampResult = await contractInstance.stampToken(owner, 0, token, amt, {
            from: owner
        });
        assert(stampResult, 'Unable to stamp tokens');
      }));
    });

    it('should draw from unstamped first', async () => {
      const to = accounts[1];
      const transferResult = await contractInstance.transfer(
          to, amt, {from: owner}
      );
      assert(transferResult, 'Unable to transfer tokens');

      await verifyBalance(contractInstance, owner, 0, totalSupply - (amt * 3) - amt, totalSupply - amt);
      await verifyBalance(contractInstance, to, 0, amt, amt);
    });

    it('should be able to transfer tokens drawing from multiple balances', async () => {
      // deplete unstamped first
      const transferResult1 = await contractInstance.transfer(
          accounts[9], totalSupply - (amt * 3), {from: owner}
      );
      assert(transferResult1, 'Unable to transfer tokens');

      const to = accounts[1];
      const transferResult2 = await contractInstance.transfer(
          to, amt * 2.5, {from: owner}
      );
      assert(transferResult2, 'Unable to transfer tokens');

      await verifyBalance(contractInstance, owner, 0, 0, amt * 0.5);
      await verifyBalance(contractInstance, to, tokens[0], amt * 0.5, amt * 2.5);
      await verifyBalance(contractInstance, to, tokens[1], amt, amt * 2.5);
      await verifyBalance(contractInstance, to, tokens[2], amt, amt * 2.5);
    });

    it('should not transfer anything if the total amount cannot be drawn from all balances', async () => {
      const to = accounts[1];

      // make a successful transfer first to get the owner's total balance below total supply
      const transferResult1 = await contractInstance.transfer(
          accounts[9], totalSupply * 0.5, {from: owner}
      );
      assert(transferResult1, 'Unable to transfer tokens');


      await assertAsyncThrows(async () =>
          contractInstance.transfer(accounts[9], totalSupply * 0.8, { from: owner })
      );

      await verifyBalance(contractInstance, owner, 0, totalSupply - (amt * 3) - (totalSupply * 0.5), totalSupply * 0.5);
      await verifyBalance(contractInstance, owner, tokens[0], amt, totalSupply * 0.5);
      await verifyBalance(contractInstance, owner, tokens[1], amt, totalSupply * 0.5);
      await verifyBalance(contractInstance, owner, tokens[2], amt, totalSupply * 0.5);
      await verifyBalance(contractInstance, to, 0, 0, 0);
    });
  });

  const verifyBalance = async (inst, acct, token, expected, expectedTotal) => {
    if (expectedTotal === undefined) expectedTotal = expected;

    const balanceTotal = await inst.balanceOf(acct);
    assert(balanceTotal == expectedTotal, `Total balance does not match expected.
      Expected: ${expectedTotal}, Actual: ${balanceTotal}`);

    const balanceToken = await inst.balanceOfToken(acct, token);
    assert(balanceToken == expected, `Token ${token} balance does not match expected.
      Expected: ${expected}, Actual: ${balanceToken}`);
  }
});

  