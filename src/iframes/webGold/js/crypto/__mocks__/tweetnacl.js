// becuase prng is not defined in nodejs env, lets override it
"use strict";

const path = require("path");
const nacl = require.requireActual("tweetnacl");

// monkeypatch (see: bitpay/bitcore-lib#34)
import crypto from "crypto";
const sourceCreateHash = crypto.createHash;
crypto.createHash = function createHash(alg) {
  if (alg === "ripemd160") {
    alg = "rmd160";
  }
  return sourceCreateHash(alg);
};

const rndfun = (x, n) => {
  console.log(`rnd called with parameters 0: ${n}, ${x}`);
  x = crypto.randomBytes(n);
  var i,
    v = crypto.randomBytes(n);
  //for (i = 0; i < n; i++) x[i] = v[i];
  return x;
};
nacl.setPRNG(rndfun); // use crypto PRNG fro testing

module.exports = nacl;
