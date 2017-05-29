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
import EthWallet from './components/wallet.js';
import CreateWallet from './components/createwallet.js';

let SATOSHI = Const.SATOSHI;

function getLoginUrl() {

    var host = window.location.host;
    host = host.replace('webgold.','login.');
    return "//"+host+'/';

}


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
        var that = this;
        return (
            <div>
                <EthWallet />
            </div>
        );
    }
}

export function RenderTxSigner() {

    require('./resizeSender.js');
    ReactDOM.render(<TxSignerView />, document.getElementById('main'));
}
