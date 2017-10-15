/**
 * Created by michbil on 10.12.15.
 */

import Const from "../../../constant.js";
let SATOSHI = Const.SATOSHI;

export default class UnitCoverter {
  constructor(rates) {
    this.rates = rates;
  }

  wrgToBtc(wrg) {
    return btc * this.rates.btcExchangeRate / (SATOSHI * Const.WRG_UNIT);
  }

  btcToWrg(btc) {
    return btc * SATOSHI * Const.WRG_UNIT / this.rates.btcExchangeRate;
  }

  wrgToUsd(wrg) {
    return wrg * this.rates.exchangeRate / Const.WRG_UNIT;
  }

  usdToWrg(usd) {
    return Const.WRG_UNIT * usd / this.rates.exchangeRate;
  }
}
