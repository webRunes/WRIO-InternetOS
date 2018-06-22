const selectContractInstance = require('./select_contract_instance');

module.exports = url =>
  selectContractInstance()
    .then(contract =>
      contract.set_profile_url(
        web3.eth.defaultAddress,
        url
      )
    )
