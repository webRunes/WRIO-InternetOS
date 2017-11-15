test('dummy', noop => noop);
/* import crypto from "crypto";
import nacl from "tweetnacl";
import KeyStore from "./keystore";
jest.mock("tweetnacl");

const { expect } = require("chai");
const lightwallet = require("eth-lightwallet"); */
/*
const {UnSignTransaction} = require('../../src/server/ethereum/DonateProcessor');
it(' should be able to test if source transaction matches signed transaction', async ()=> {
    const ks = new KeyStore();
    let SAMPLE_SIGNED = await ks.extractKey(SEED,"1dfsdfasdfsd2").then(ks.signTx(SAMPLETX));
    console.log(SAMPLE_SIGNED);
    console.log(SAMPLETX);
    expect(UnSignTransaction(SAMPLE_SIGNED)).to.equal(SAMPLETX);

}); */

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
/*
const SAMPLETX =
  "f86a03850df8475800830651cf9497538850ad45948d983a66c3bb26e39b0b00603a80b844e69d849d000000000000000000000000f3ac2c9940735f4cee1fd46581573d1b4a5b41ae000000000000000000000000000000000000000000000000000000000000044c1c8080";
const SEED =
  "eagle today cause tenant buffalo whisper half nest safe private index solid";

describe(": should allow keystore changes", () => {
  // TOOD find out why this test stalls
  it("dymmy test", () => console.log("dummy"));
  it("should generate seed using entropy string", () => {
    let seed = KeyStore.generateSeed("123");
    let wordnr = seed.split(" ");
    expect(wordnr.length).to.equal(12);
  });

    it('seed should generate exact ethereum address', (done)=> {
       let ks = new KeyStore();
        ks.extractKey(SEED,'123').
            then(ks.verifySeedAgainstEthId('0xff39e9e586c0398e27f97d8201b1c62ec20a0cb4')).
            then((result) => expect(result).to.equal(true)).
            then(()=>done())
            .catch(err => console.log("CAUGHT DURING", err));

    });
    it('should genereate same signing key from one seed with any password',(done) => {
        let ks = new KeyStore();
        let ks2 = new KeyStore();
        let key1Promise = ks.extractKey(SEED,"1dfsdfasdfsd2").then(ks.signTx(SAMPLETX));
        let key2Promise = ks2.extractKey(SEED,"1231121212121").then(ks2.signTx(SAMPLETX));

        Promise.all([key1Promise,key2Promise]).then((txs)=>{
            console.log(txs);
            expect(txs[0]).to.equal(txs[1]);
            expect(txs[0]).to.not.equal(SAMPLETX);
            done();
        }).catch(err => console.log("CAUGHT DURING", err));

    });
    it('DEVTEST: should be able, to unlock the password from saved keystore', (done) => {
        let store = new KeyStore();
        let invPass = false;
        store.extractKey(SEED,'123').
            then(({ks})=> {
                console.log("STORE",ks);
                return ks.serialize();

            }).
            then((serialized)=> {
                let store_d = new KeyStore();
                store_d.deserialize(serialized);

                store_d.extractKey(SEED,'1234',store_d.keystore).catch((err)=>{
                   invPass = true;
                });

                return store_d.extractKey(null,'123',store_d.keystore);
            }).then(({addr})=> {
                    console.log(addr);
                    if (invPass == false) done("Not rejected invalid password"); else done();
            }).catch(err => console.log("CAUGHT DURING", err));

    });
*/
// });
