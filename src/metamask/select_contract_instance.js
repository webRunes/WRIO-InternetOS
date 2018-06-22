import contract from 'truffle-contract';
import abi from '../../build/contracts/WRIOOS.json'

module.exports = () => {
  return new Promise(res => {
    const myContract = contract(abi);
    myContract.setProvider(window.web3.currentProvider);
    myContract
      .deployed()
      .then(instance => res(instance))
  })
}
