import React from 'react';
import Actions from '../../stores/PaymentActions';
import BigNumber from 'bignumber.js';
import Const from '../../../../constant.js';

class Amount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            BTC: new BigNumber(0.1),
            WRG: new BigNumber(0),
            error: null
        };
        Actions.changeAmount(this.state);
    }
    
    componentWillReceiveProps(props) {

        var rate = props.exchangeRate;
        if (rate) {
            this.setState({
                BTC: this.state.BTC,
                WRG: this.state.BTC.mul(Const.WRG_UNIT).div(rate)
            });
        }
    }

    formatWRG(num) {
            var str = num.toString();
            if (str.length >= 3) {
                str = str.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
            }

            return str;
    }

    validateAmount(amount) {
        return !amount.gt(Const.MAX_DONATE);
    }

    setAmount(BTC, wrg) {
        var amount = {
            BTC: BTC,
            WRG: wrg
        };

        if (!this.validateAmount(wrg)) {
            var w = new BigNumber(Const.MAX_DONATE);
            var b = wrg.mul(this.props.exchangeRate).div(Const.WRG_UNIT);
            amount = {
                BTC:b,
                WRG: w
            };
        }

        this.setState(amount);
        Actions.changeAmount(amount);

    }
    
    onBTCChange(e) {
        var BTC = new BigNumber(e.target.value.replace(",","."));
        var wrg = BTC.mul(Const.WRG_UNIT).div(this.props.exchangeRate);
        this.setAmount(BTC,wrg);
    }
    
    onWRGChange(e) {
        var wrg = new BigNumber(e.target.value.replace(",","."));
        var BTC = wrg.mul(this.props.exchangeRate).div(Const.WRG_UNIT);

        this.setAmount(BTC,wrg);
    }
    
    render() {
        var BTC = this.state.BTC.toString();
        var wrg = this.state.WRG.toFixed(2).toString();

        var cls = "col-xs-5 col-sm-4 col-md-4 col-lg-3" + (this.state.error ? " has-error": "");

        return (
             <div className="form-group">
                <label className="col-xs-12 col-sm-4 col-md-3 control-label" htmlFor="amountBTC">Amount</label>

                <div className={cls}>
                    <div className="input-group">
                        <span className="input-group-addon">WRG</span>
                        <input type="number" step="0.1" className="form-control" name="amountWRG" value={wrg} onChange={ this.onWRGChange.bind(this) } min="0" />
                    </div>
                    <div className="help-block"></div>
                </div>

                 <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 align-center">
                     <label className="control-label" style={{paddingTop:"8px"}}>{'='}</label>
                 </div>

                 <div className={cls}>
                     <div className="input-group tooltip-demo">
                         <span className="input-group-addon">BTC</span>
                         <input type="number" step="0.001" className="form-control" name="amount" value={BTC} onChange={ this.onBTCChange.bind(this) } min="0.1" />
                     </div>
                 </div>

            </div>
        );
    }
}

Amount.propTypes = {
    exchangeRate: React.PropTypes.object
};

export default Amount;