import React from 'react';
import ReactDOM from 'react-dom';
import User from './components/User';
import Info from './components/Info';
import PaymentForm from './components/PaymentForm';
import request from 'superagent';
import PaymentHistory from './components/PaymentHistory';
import EthereumClient from './components/EthereumClient';
import BigNumber from 'bignumber.js';
import Const from '../../constant.js';
import EthWallet from './components/Wallet/wallet.js';


let SATOSHI = Const.SATOSHI;

// send message to parent upon popup closing
window.okGO = false;
window.addEventListener("beforeunload", function(e){
    if (!okGO) {
        window.opener.postMessage(JSON.stringify({"cancelPopup":true}),"*")
    }
}, false);


class TxSignerView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            exchangeRate: 10,
            showpending: false
        };
    }

    render() {
        return (
            <div className="container">
                <EthWallet ethID={window.params.ethID}
                           tx={window.params.tx}
                           to={window.params.to}
                           wrioID={window.params.wrioID}
                           amount={window.params.amount}/>
            </div>
        );
    }
}


require('./resizeSender.js');
ReactDOM.render(<TxSignerView />, document.getElementById('main'));
