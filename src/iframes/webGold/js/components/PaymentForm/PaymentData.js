import React from 'react';

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
              <h2>Please send <b>{this.props.amount}</b>BTC to the bitcoin adress <b>{this.props.adress}</b></h2>
              <div id="qrcode"></div>

            </div>
        );
    }
}
PaymentData.propTypes = {
    adress: React.PropTypes.string,
    amount:React.PropTypes.string
};

export default PaymentData;