import React from 'react';
import ReactDOM from 'react-dom';
import User from './components/User';
import Info from './components/Info';
import PresaleForm from './components/PresaleForm';
import request from 'superagent';
import PaymentHistory from './components/PaymentHistory';
import EthereumClient from './components/EthereumClient';
import BigNumber from 'bignumber.js';
import Const from '../../constant.js';


let SATOSHI = Const.SATOSHI;

function getLoginUrl() {

    var host = window.location.host;
    host = host.replace('webgold.','login.');
    return "//"+host+'/';
}

const PRESALE_PRICE = 120000.0;

class Presale extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            exchangeRate: 10,
            showpending: false,
            loginUrl: getLoginUrl(),
            btcExchangeRate: (new BigNumber(1000)).div(PRESALE_PRICE)
        };

        this.gotEmail = this.gotEmail.bind(this)

    }

    componentWillMount() {

    }

    componentDidMount() {
        frameReady();
    }

    gotEmail(err,mail) {
        console.log(`ERR ${err} MAIL ${mail}`);
    }

    componentDidUpdate() {
        setTimeout(window.frameReady,100);
    }

    render() {
        return (
                <PresaleForm
                    exchangeRate={ this.state.btcExchangeRate }
                    loginUrl={ this.state.loginUrl } />
        );
    }
}

export function RenderPresale() {
    require('./resizeSender.js');
    ReactDOM.render(<Presale />, document.getElementById('main'));
}
