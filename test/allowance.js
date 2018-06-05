const FanCoin = artifacts.require('FanCoin');

const { owner, totalSupply, assertAsyncThrows } = require('./globals');

contract('FanCoin', accounts => {
  var contractInstance = null;
  before(async () => {
    contractInstance = await FanCoin.new();
  });

  describe('allowance', () => {
    var allowanceAmt = 1337;
    it('should allow basic approval', async () => {
      const result = await contractInstance.approve(
        accounts[3],
        allowanceAmt,
        { from: owner }
      );

      assert(result);
      assert(await contractInstance.allowance(owner, accounts[3]) == allowanceAmt);
    });

    it('should not allow approval override', async () => {
      const result = await contractInstance.approve(
        accounts[9],
        allowanceAmt,
        { from: owner }
      );

      assert(result);
      assert(await contractInstance.allowance(owner, accounts[3]) == allowanceAmt);

      await assertAsyncThrows(
        () => contractInstance.approve(
          accounts[9], 
          allowanceAmt + 2,
          { from: owner }
        ),
        /revert/g
      );
    });

    it('should not allow spending of more than allowance', async () =>
      assertAsyncThrows(async () =>
        await contractInstance.transferFrom(
          owner,
          accounts[4],
          allowanceAmt + 1,
          { from: accounts[3] }
        ),
        /revert/g
      )
    );

    it('should not allow spending of less than 0', async () =>
      assertAsyncThrows(async () =>
        await contractInstance.transferFrom(owner, accounts[4], -5, {
          from: accounts[3]
        }),
        /revert/g
      )
    );

    it('should not allow spending of more than balance', async () =>
      assertAsyncThrows(async () =>
        await contractInstance.transferFrom(
          owner,
          accounts[4],
          totalSupply,
          { from: accounts[3] }
        ),
        /revert/g
      )
    );

    it('should decrease spending amount', async () => {
      const decreaseBy = 1000;
      const result = await contractInstance.decreaseApproval(
        accounts[3],
        decreaseBy,
        { from: owner }
      );

      allowanceAmt -= decreaseBy;
      assert(result);
      assert(await contractInstance.allowance(owner, accounts[3]) == allowanceAmt);
    });

    it('should increase spending amount', async () => {
      const increaseBy = 1005;
      const result = await contractInstance.increaseApproval(
        accounts[3],
        increaseBy,
        { from: owner }
      )

      allowanceAmt += increaseBy;
      assert(result);
      assert(await contractInstance.allowance(owner, accounts[3]) == allowanceAmt);
    });
  });
});