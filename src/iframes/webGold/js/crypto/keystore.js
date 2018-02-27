import lightwallet from 'eth-lightwallet';

const keyStore = lightwallet.keystore;

export default class KeyStore {
  extractKey(seed, password, store) {
    return new Promise((resolve, reject) => {
      if (store) {
        extract(null, store);
      } else {
        keyStore.createVault(
          {
            password,
            seedPhrase: seed, // Optionally provide a 12-word seed phrase
            // salt: fixture.salt,     // Optionally provide a salt.
            // A unique salt will be generated otherwise.
            hdPathString: "m/0'/0'/0'", // Optional custom HD Path String
          },
          extract,
        );
      }
      function extract(err, ks) {
        if (err) return reject(err);
        ks.keyFromPassword(password, (err, pwDerivedKey) => {
          if (err) return reject(err);

          // generate five new address/private key pairs
          // the corresponding private keys are also encrypted
          ks.generateNewAddress(pwDerivedKey, 1);
          const addr = ks.getAddresses()[0];
          resolve({ addr, pwDerivedKey, ks });
        });
      }
    });
  }

  signTx(tx) {
    return ({ addr, pwDerivedKey, ks }) => lightwallet.signing.signTx(ks, pwDerivedKey, tx, addr);
  }

  verifySeedAgainstEthId(id) {
    return ({ addr, pwDerivedKey, ks }) => {
      console.log('Comparing ', id, addr);
      return id == addr;
    };
  }

  static generateSeed(entropy) {
    return lightwallet.keystore.generateRandomSeed(entropy);
  }

  // private members, not use otside class

  deserialize(serialized) {
    this.keystore = lightwallet.keystore.deserialize(serialized);
  }

  newAddress(password, cb) {
    if (password == '') {
      password = prompt('Enter password to retrieve addresses', 'Password');
    }
    lightwallet.keystore.deriveKeyFromPassword(password, (err, pwDerivedKey) => {
      if (err) {
        return cb(err);
      }
      this.keystore.generateNewAddress(pwDerivedKey, 1);
      const addresses = this.keystore.getAddresses();
      cb(null, addresses[0]);
    });
  }

  getSeed(password, cb) {
    lightwallet.keystore.deriveKeyFromPassword(password, (err, pwDerivedKey) => {
      const seed = this.keystore.getSeed(pwDerivedKey);
      console.log(`Your seed is: "${seed}". Please write it down.`);
      cb(seed);
    });
  }

  init_keystore(seed, password, cb) {
    lightwallet.keystore.deriveKeyFromPassword(password, (err, pwDerivedKey) => {
      if (err) {
        cb(err);
        return;
      }
      try {
        this.keystore = new lightwallet.keystore(seed, pwDerivedKey);
      } catch (e) {
        console.log(e);
        return cb(`Err ${e}`);
      }

      console.log(this.keystore.serialize());
      cb(null);
    });
  }
}
