import assert from 'assert';
import should from 'should';
import {
  ROPSTEN_PROVIDER_URL,
  THX_CONTRACT_ADDRESS,
  THX_ABI,
  getWeb3,
  getCrdBalanceFromContract
} from './web3Balance.js';

describe('web3Balance tests', () => {
  it('should have correct constants defined', () => {
    ROPSTEN_PROVIDER_URL.should.be.eql('https://ropsten.infura.io/v3/5781ce2cf70946faa41c5fd9e6cbf0f7');
    THX_CONTRACT_ADDRESS.should.be.eql('0x97538850ad45948d983a66c3bb26e39b0b00603a');
    Array.isArray(THX_ABI).should.be.true();
    THX_ABI.some(item => item.name === 'coinBalanceOf').should.be.true();
    THX_ABI.some(item => item.name === 'rewardOf').should.be.true();
  });

  it('should instantiate Web3 correctly', () => {
    const web3 = getWeb3();
    assert(web3 !== null && web3 !== undefined);
    assert(typeof web3.eth === 'object');
  });

  it('should reject if wallet address is missing', async () => {
    try {
      await getCrdBalanceFromContract('');
      assert.fail('Should have thrown');
    } catch (err) {
      err.message.should.containEql('Wallet address not provided');
    }
  });

  it('should query CRD balance and reward from contract correctly', async () => {
    const fakeWeb3 = {
      eth: {
        contract: (abi) => ({
          at: (address) => ({
            coinBalanceOf: {
              call: (wallet, cb) => {
                wallet.should.be.eql('0x1234567890abcdef1234567890abcdef12345678');
                cb(null, 5000); // 5000 cWRG = 50 CRD
              }
            },
            rewardOf: {
              call: (wallet, cb) => {
                wallet.should.be.eql('0x1234567890abcdef1234567890abcdef12345678');
                cb(null, 250); // 250 cWRG = 2.5 RTX
              }
            }
          })
        }),
        getBalance: (wallet, cb) => {
          cb(null, 0);
        }
      }
    };

    const res = await getCrdBalanceFromContract('0x1234567890abcdef1234567890abcdef12345678', fakeWeb3);
    res.balance.should.be.eql(50);
    res.rtx.should.be.eql(2.5);
  });

  it('should fallback to web3.eth.getBalance when contract call fails', async () => {
    const fakeWeb3 = {
      eth: {
        contract: (abi) => ({
          at: (address) => ({
            coinBalanceOf: {
              call: (wallet, cb) => {
                cb(new Error('Contract call failed'), null);
              }
            },
            rewardOf: {
              call: (wallet, cb) => {
                cb(new Error('Contract call failed'), null);
              }
            }
          })
        }),
        getBalance: (wallet, cb) => {
          cb(null, 1000); // 1000 cWRG = 10 CRD
        }
      }
    };

    const res = await getCrdBalanceFromContract('0x1234567890abcdef1234567890abcdef12345678', fakeWeb3);
    res.balance.should.be.eql(10);
    res.rtx.should.be.eql(0);
  });

  it('should reject when contract call and fallback both fail', async () => {
    const fakeWeb3 = {
      eth: {
        contract: (abi) => ({
          at: (address) => ({
            coinBalanceOf: {
              call: (wallet, cb) => {
                cb(new Error('Contract call failed'), null);
              }
            },
            rewardOf: {
              call: (wallet, cb) => {
                cb(new Error('Contract call failed'), null);
              }
            }
          })
        }),
        getBalance: (wallet, cb) => {
          cb(new Error('RPC connection failed'), null);
        }
      }
    };

    try {
      await getCrdBalanceFromContract('0x1234567890abcdef1234567890abcdef12345678', fakeWeb3);
      assert.fail('Should have thrown');
    } catch (err) {
      assert(err !== null);
    }
  });
});
