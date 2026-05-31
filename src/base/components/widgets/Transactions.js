import React from "react";
import { getServiceUrl, getDomain } from "../../servicelocator.js";
import { transactionsHeight } from "base/actions/WindowMessage";
var domain = getDomain();

const transFrameUrl = getServiceUrl("webgold") + "/transactions";

// Constants for CRD calculation
const TOTAL_CRD_WRG = 40000;
const WRG_TO_USD_RATE_WRG = 1000;
const WRG_TO_USD_RATE_USD = 40;
const TOTAL_CRD_IN_USD = (TOTAL_CRD_WRG / WRG_TO_USD_RATE_WRG) * WRG_TO_USD_RATE_USD;

class CreateTransactions extends React.Component {
  createTransactionsWidget() {
    const iframe = document.getElementById("transactionsiframe");
    if (iframe) {
      iframe.style.height = "240px";
    }
    this.subscription = transactionsHeight.subscribe(ht => {
      const iframe = document.getElementById("transactionsiframe");
      if (iframe) {
        iframe.style.height = ht + "px";
      }
    });
  }

  componentDidMount() {
    this.createTransactionsWidget();
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  render() {
    const editIframeStyles = {
      width: "100%",
      border: "none"
    };
    return (
      <div>
        <div className="crd-total-info">
          <h3>CRD Total</h3>
          <p>Total issued CRD: {TOTAL_CRD_WRG} WRG</p>
          <p>Equivalent to: {TOTAL_CRD_IN_USD} <sup><small className="currency">USD</small></sup></p>
          <p><em>(1,000 WRG = {WRG_TO_USD_RATE_USD} USD)</em></p>
        </div>
        <section key="b">
          <iframe
            id="transactionsiframe"
            src={transFrameUrl}
            frameBorder="no"
            scrolling="no"
            style={editIframeStyles}
          />
        </section>
      </div>
    );
  }
}

export default CreateTransactions;
