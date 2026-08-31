import Web3 from 'web3';

// Ropsten testnet Infura endpoint (consistent with DeviceProfile.js)
export const ROPSTEN_PROVIDER_URL =
  'https://ropsten.infura.io/v3/5781ce2cf70946faa41c5fd9e6cbf0f7';

// THX.sol smart contract address on Ropsten
export const THX_CONTRACT_ADDRESS =
  '0x97538850ad45948d983a66c3bb26e39b0b00603a';

// ABI for THX smart contract containing coinBalanceOf and rewardOf
export const THX_ABI = [
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'coinBalanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'rewardOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'receiver', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'emitCoin',
    outputs: [{ name: 'sufficient', type: 'bool' }],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'receiver', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'sendCoin',
    outputs: [{ name: 'sufficient', type: 'bool' }],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'receiver', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'donate',
    outputs: [{ name: 'sufficient', type: 'bool' }],
    payable: false,
    type: 'function',
  },
  {
    inputs: [],
    payable: false,
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'sender', type: 'address' },
      { indexed: false, name: 'receiver', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'CoinTransfer',
    type: 'event',
  },
];

let web3Instance = null;

export const getWeb3 = (providerUrl = ROPSTEN_PROVIDER_URL) => {
  if (!web3Instance) {
    web3Instance = new Web3(new Web3.providers.HttpProvider(providerUrl));
  }
  return web3Instance;
};

/**
 * Reads CRD balance for a given wallet address from THX.sol smart contract or web3 getBalance
 * @param {string} walletAddress - Ethereum wallet address
 * @param {object} [customWeb3] - Optional Web3 instance
 * @returns {Promise<{balance: number, rtx: number}>}
 */
export const getCrdBalanceFromContract = (walletAddress, customWeb3) => {
  return new Promise((resolve, reject) => {
    try {
      if (!walletAddress) {
        return reject(new Error('Wallet address not provided'));
      }
      const web3 = customWeb3 || getWeb3();
      const contract = web3.eth.contract(THX_ABI).at(THX_CONTRACT_ADDRESS);

      // Query coinBalanceOf on THX contract
      contract.coinBalanceOf.call(walletAddress, (err, balance) => {
        if (err) {
          // Fallback to web3.eth.getBalance if contract call fails
          web3.eth.getBalance(walletAddress, (ethErr, ethBalance) => {
            if (ethErr) {
              return reject(err || ethErr);
            }
            const bal = ethBalance ? Number(ethBalance) / 100 : 0;
            resolve({ balance: bal, rtx: 0 });
          });
          return;
        }

        // Also query rewardOf (rtx)
        contract.rewardOf.call(walletAddress, (rtxErr, rtx) => {
          // coinBalance is in cWRG (1/100th of WRG/CRD)
          const bal = balance ? Number(balance) / 100 : 0;
          const rtxVal = !rtxErr && rtx ? Number(rtx) / 100 : 0;
          resolve({ balance: bal, rtx: rtxVal });
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};
