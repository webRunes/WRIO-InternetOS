import React from "react";
import ReactDOM from "react-dom";
import User from "./components/User";
import Info from "./components/Info";
import PaymentForm from "./components/PaymentForm";
import request from "superagent";
import PaymentHistory from "./components/PaymentHistory";
import EthereumClient from "./components/EthereumClient";
import BigNumber from "bignumber.js";
import Const from "../../constant.js";
import CreateWallet from "./components/Wallet/createwallet.js";

let SATOSHI = Const.SATOSHI;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      exchangeRate: 10,
      showpending: false
    };
  }
  componentWillMount() {}

  componentDidMount() {
    //  frameReady();
  }

  render() {
    return (
      <div>
        <CreateWallet wrioID={window.params.wrioID} />
      </div>
    );
  }
}

(function() {
  var throttle = function(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
        // For IE compatibility
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(name, false, false, {
          cmd: "resize"
        });
        obj.dispatchEvent(evt);
        // obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  /* init - you can init any event */
  throttle("resize", "optimizedResize");
})();

// handle event
window.addEventListener("optimizedResize", function() {
  frameReady();
});

window.frameReady = function() {
  var ht = $("#main").height();
  console.log("Webgold height", ht);
  parent.postMessage(JSON.stringify({ webgoldHeight: ht }), "*"); // signal that iframe is renered and ready to go, so we can calculate it's actual height now
  return true;
};

ReactDOM.render(<App />, document.getElementById("main"));
