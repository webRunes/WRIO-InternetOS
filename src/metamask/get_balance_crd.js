let contract;

const init_contract = cb => {
  const abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"rewardOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"emitCoin","outputs":[{"name":"sufficient","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"sendCoin","outputs":[{"name":"sufficient","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"coinBalanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"donate","outputs":[{"name":"sufficient","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"CoinTransfer","type":"event"}];
  const address = '0x97538850ad45948d983a66c3bb26e39b0b00603a';

  if (contract) return cb(contract);

  return web3.eth
    .contract(abi)
    .at(address, (err, contract) =>
      cb(contract)
    )
};

module.exports = cb =>
  init_contract(contract =>
    contract.coinBalanceOf.call(
      web3.eth.accounts[0],
      (err, res) => {
        cb(res.toNumber());
      }
    )
  )
