/**
 * Created by michbil on 06.12.15.
 */
import Reflux from "reflux";
import Actions from "../actions/transactions.js";
import request from "superagent";
import Const from "../../../constant.js";
// {
//    title:"sdfsd",
//        date:'121',
//    id:0,
//    amount: 600,
//    state:"Complete"
// }

import UnitConverter from "../libs/units.js";

function limitBTCDigits(x) {
  return Math.floor(x * 100000000) / 100000000;
}

let SATOSHI = Const.SATOSHI;

module.exports = Reflux.createStore({
  listenables: Actions,
  transactions: [],

  // donation sorter
  adjustUnits() {
    this.transactions = this.transactions.map(transaction => {
      if (transaction.amountBTC) {
        transaction.amount = this.exchange
          .btcToWrg(transaction.amountBTC)
          .toFixed(2);
      }
      transaction.amountUSD = this.exchange
        .wrgToUsd(transaction.amount)
        .toFixed(2);
      return transaction;
    });
  },

  onRate(rate) {
    console.log("Got rates, updating items according to rates");
    this.exchange = new UnitConverter(rate);
    this.adjustUnits();
  },

  sortedAppend(data) {
    this.transactions = this.transactions.concat(data).sort((x, y) => {
      var d1 = new Date(x.timestamp);
      var d2 = new Date(y.timestamp);

      if (d1 - d2 == 0) {
        return 0;
      } else if (d1 > d2) {
        return 1;
      } else {
        return -1;
      }
    });
  },

  init() {
    var that = this;

    this.requestPaymentHistory((err, state) => {
      if (err) {
        console.log("Cant get payment history:", err);
        if (err.status === 403) {
          that.trigger({ error: "You're not allowed to see this page" });
        } else {
          that.trigger({ error: "Oops! Something went wrong!" });
        }

        return;
      }
      //console.log(state);
      that.sortedAppend(
        state.map(element => {
          var amount = limitBTCDigits(element.requested_amount / SATOSHI);
          return {
            id: element._id,
            type: "add_funds",
            amount: "",
            amountUSD: "",
            amountBTC: amount,
            state: element.state,
            timestamp: element.timestamp
          };
        })
      );
      if (this.exchange) {
        this.adjustUnits();
      }
      that.trigger(that.transactions);
    });
    this.requestDonations((err, state) => {
      if (err) {
        console.log("Cant get donations: " + err);
        if (err.status === 403) {
          that.trigger({ error: "Forbidden" });
        } else {
          that.trigger({ error: "Oops! Something went wrong!" });
        }
        return;
      }
      // console.log(state);
      that.sortedAppend(
        state.map(element => {
          return {
            id: element._id,
            type: "donation",
            amount: element.amount,
            amountUSD: "",
            timestamp: element.timestamp,
            incoming: element.incoming,
            destName: element.destName,
            srcName: element.srcName
          };
        })
      );
      if (this.exchange) {
        this.adjustUnits();
      }
      that.trigger(that.transactions);
    });

    this.requestPrepayments((err, state) => {
      if (err) {
        console.log("Cant get prepayments: " + err);
        if (err.status === 403) {
          that.trigger({ error: "Forbidden" });
        } else {
          that.trigger({ error: "Oops! Something went wrong!" });
        }
        return;
      }
      console.log("Prepayments", state);
      that.sortedAppend(
        state.map(element => {
          return {
            id: element.id,
            type: "prepayment",
            amount: element.amount,
            amountUSD: "",
            timestamp: element.timestamp,
            incoming: element.incoming,
            destName: element.destName,
            srcName: element.srcName
          };
        })
      );
      that.trigger(that.transactions);
    });
  },

  requestPaymentHistory(cb) {
    request
      .get("/api/blockchain/payment_history")
      .set("X-Requested-With", "XMLHttpRequest")
      .end((err, users) => {
        if (err) {
          cb(err);
          return;
        }
        cb(null, JSON.parse(users.text));
      });
  },

  requestDonations(cb) {
    request
      .get("/api/user/donations")
      .set("X-Requested-With", "XMLHttpRequest")
      .end((err, users) => {
        if (err) {
          cb(err);
          return;
        }
        cb(null, JSON.parse(users.text));
      });
  },

  requestPrepayments(cb) {
    request
      .get("/api/user/prepayments")
      .set("X-Requested-With", "XMLHttpRequest")
      .end((err, users) => {
        if (err) {
          cb(err);
          return;
        }
        cb(null, JSON.parse(users.text));
      });
  },

  getAll() {
    return this.transactions;
  }
});
