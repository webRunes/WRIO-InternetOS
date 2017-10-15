/**
 * Created by michbil on 07.12.15.
 */

/**
 * Created by michbil on 06.12.15.
 */
import Reflux from "reflux";
import Actions from "../actions/transactions.js";
import request from "superagent";
import Const from "../../../constant.js";

function limitBTCDigits(x) {
  return Math.floor(x * 100000000) / 100000000;
}

let SATOSHI = Const.SATOSHI;

module.exports = Reflux.createStore({
  balance: 0,
  usdRate: 0,
  btcRate: 0,

  init() {
    var that = this;
    request
      .get("/api/webgold/get_balance")
      .set("X-Requested-With", "XMLHttpRequest")
      .withCredentials()
      .end((err, data) => {
        if (err) {
          throw new Error("Can't get balance");
        }
        console.log(data.body);
        that.balance = data.body.balance;
        Actions.Balance.trigger(that.balance);
      });
    request
      .get("/add_funds_data")
      .set("X-Requested-With", "XMLHttpRequest")
      .withCredentials()
      .end((err, data) => {
        if (err) {
          throw new Error("Can't get rates");
        }
        console.log(data.body);
        that.rates = data.body;
        Actions.Rate.trigger(that.rates);
      });
  }
});
