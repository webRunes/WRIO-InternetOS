import React from "react";
import QRCode from "../../3rdparty/qrcode";
import PropTypes from "prop-types";

class PaymentData extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("PaymentData Mounted");
    new QRCode(document.getElementById("qrcode"), this.props.adress);
  }

  render() {
    return (
      <div>
        <h2>
          Please send <b>{this.props.amount}</b>BTC to the bitcoin adress{" "}
          <b>{this.props.adress}</b>
        </h2>
        <div id="qrcode" />
      </div>
    );
  }
}
PaymentData.propTypes = {
  adress: PropTypes.string,
  amount: PropTypes.string
};

export default PaymentData;
