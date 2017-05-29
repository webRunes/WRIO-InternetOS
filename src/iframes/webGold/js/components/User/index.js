import React from 'react';
import UserInfo from './UserInfo';
import request from 'superagent';
import BigNumber from 'bignumber.js';
import Const from '../../../../constant.js';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: null
        };
        this.requestBalance((err,balance) => {
            if (balance) {
                var amount = new BigNumber(JSON.parse(balance).balance);
                console.log("Ethereum balance", amount);
                this.setState({
                    balance: amount
                });
            }
        });
    }

    requestBalance(cb) {
        request.get('/api/webgold/get_balance').
            withCredentials().
            set('X-Requested-With',"XMLHttpRequest").
            end((err,balance)=> {
            if (err) {
                cb(err);
                return;
            };
            cb(null,balance.text);
        });
    }

    render() {
        var btcRate = this.props.btcExchangeRate.toFixed(8);
        var usdBalance = "...";
        var wrgBalance = "....";
        if (this.state.balance) {
            var coef = (new BigNumber(Const.WRG_UNIT)).div(this.props.exchangeRate);
            usdBalance =  this.state.balance.div(coef).toFixed(2);
            wrgBalance = this.state.balance.toFixed(2);
        }


        return (
            <div className="form-group">
                <ul className="leaders">
                    <li>
                        <span>Current Balance&nbsp;</span>
                        <span>{wrgBalance}<small className="currency">WRG</small><sup className="currency" ref="usdBalance">{usdBalance} USD</sup></span>
                    </li>
                    <li>
                        <span>Exchange Rate&nbsp;</span>
                        <span>&nbsp;1 000<small className="currency">WRG = </small>{btcRate}<small className="currency">BTC</small><sup className="currency">{this.props.exchangeRate} USD</sup></span>
                    </li>
                </ul>
            </div>
        );
    }
}

User.propTypes = {
    username: React.PropTypes.string.isRequired,
    btcExchangeRate: React.PropTypes.object,
    exchangeRate: React.PropTypes.object
};

export default User;