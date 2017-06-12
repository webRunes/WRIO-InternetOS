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
            <div className = "col-xs-12">
                <div className="well enable-comment">
                    <h4>Payment request created</h4>
                    <p>Please send <b>{this.props.amount}</b>BTC to the address <b>{this.props.adress}</b></p>
                    <br />
                    <div id="qrcode"></div>
                    <a className="btn btn-sm btn-default" href="https://webgold.wrioos.com/?list=Offer" role="button"><span className="glyphicon glyphicon-remove"></span>Cancel</a>
                </div>
            </div>
        );
    }
}
PaymentData.propTypes = {
    adress: React.PropTypes.string,
    amount:React.PropTypes.string
};

export default PaymentData;