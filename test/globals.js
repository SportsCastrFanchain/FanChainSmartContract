module.exports = {
  owner: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
  totalSupply: 6e8 * Math.pow(10, 4),
  assertAsyncThrows: async (fn, regExp) => {
    let f = () => 0;
    try {
      await fn();
    } catch (e) {
      f = () => { throw e; };
    } finally {
      assert.throws(f, regExp);
    }
  }
};