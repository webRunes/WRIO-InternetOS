import React from "react";
import Amount from "./Amount";
import AddFunds from "./AddFunds";
import Alert from "./Alert";
import BincoinForm from "./BitcoinForm";
import PaymentStore from "../../stores/PaymentStore";
import PaymentData from "./PaymentData";
import request from "superagent";
import Const from "../../../../constant.js";
import PropTypes from "prop-types";

let SATOSHI = Const.SATOSHI;

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: null,
      payment_data: null,
      amount: 0.0
    };
  }

  changeAmount(status) {
    this.setState({ amount: status.amount });
  }

  componentDidMount() {
    var that = this;
    this.unsubscribe = PaymentStore.listen(function onStatusChange(status) {
      that.changeAmount(status);
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  addFunds(e) {
    e.preventDefault();

    var form = e.target;

    request
      .post("/api/blockchain/request_payment")
      .set("X-Requested-With", "XMLHttpRequest")
      .send({
        amount: parseFloat(form.amount.value) * SATOSHI,
        amountWRG: parseFloat(form.amountWRG.value)
      })
      .end((err, res) => {
        if (err) {
          return this.setState({
            alert: {
              type: "error",
              message: "Error: " + err.message
            }
          });
        }

        var result = JSON.parse(res.text);
        this.setState({
          payment_data: {
            amount: result.amount,
            adress: result.adress
          }
        });
      });
  }

  onAlertClose() {
    this.setState({
      alert: null
    });
  }

  render() {
    if (this.state.payment_data) {
      setTimeout(frameReady, 600); // TODO using global function, this is wrong, make properly next time
    }
    return (
      <form id="checkout" method="post" onSubmit={this.addFunds.bind(this)}>
        {this.state.payment_data ? (
          <PaymentData
            amount={this.state.payment_data.amount / SATOSHI}
            adress={this.state.payment_data.adress}
          />
        ) : (
          ""
        )}
        {this.state.alert ? (
          <Alert
            type={this.state.alert.type}
            message={this.state.alert.message}
            onClose={this.onAlertClose.bind(this)}
          />
        ) : (
          ""
        )}

        {this.state.payment_data ? (
          ""
        ) : (
          <div>
            <Amount exchangeRate={this.props.exchangeRate} />
            <AddFunds />
          </div>
        )}
      </form>
    );
  }
}
PaymentForm.propTypes = {
  exchangeRate: PropTypes.object
};

export default PaymentForm;
