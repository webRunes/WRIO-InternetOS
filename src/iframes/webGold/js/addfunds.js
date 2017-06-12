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

let SATOSHI = Const.SATOSHI;
function getLoginUrl() {

    var host = window.location.host;
    host = host.replace('webgold.','login.');
    return "//"+host+'/';

}

class AddFunds extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            exchangeRate: 10,
            showpending: false

        };
    }


    componentWillMount() {
        this.state.loginUrl = getLoginUrl();
        request
            .get('/add_funds_data')
            .end((err, res) => {
                if (err) {
                    return console.log('Error:', err.message);
                }

                this.setState({
                    username: res.body.username,
                    loginUrl: res.body.loginUrl,
                    balance: res.body.balance,
                    exchangeRate: res.body.exchangeRate,
                    btcExchangeRate: new BigNumber(res.body.btcExchangeRate).div(SATOSHI)
                });
                console.log("BTC exchange rate", this.state.btcExchangeRate.toString());
                console.log("USD exchange rate", this.state.exchangeRate );
                frameReady();
            });
    }

    componentDidMount() {
        frameReady();
    }

    render() {

        var that = this;

        function expand() {
            that.setState({showpending: !that.state.showpending});
        }
        return (
            <div>
                { this.state.username ?
                    <User
                        username={ this.state.username }
                        balance={ this.state.balance }
                        btcExchangeRate={ this.state.btcExchangeRate  }
                        exchangeRate={ this.state.exchangeRate  }/> : '' }
                <Info />

                <PaymentForm
                    exchangeRate={ this.state.btcExchangeRate }
                    loginUrl={ this.state.loginUrl } />

                <a href="javascript:;" onClick={expand}>See pending payments</a>
                { this.state.showpending ? <PaymentHistory /> : "" }

            </div>
        );
    }
}


export function RenderAddFunds() {
    require('./resizeSender.js');
    ReactDOM.render(<AddFunds />, document.getElementById('main'));
}
