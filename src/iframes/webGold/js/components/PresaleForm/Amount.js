import React from 'react';
import Actions from '../../stores/PaymentActions';
import BigNumber from 'bignumber.js';
import Const from '../../../../constant.js';

class Amount extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.onBTCChange("0.1");
        this.state.error = null;
        Actions.changeAmount(this.state);
    }
    
    componentWillReceiveProps(props) {

        var rate = props.exchangeRate;
        if (rate) {
           // this.onBTCChange(this.state.BTC);
        }
    }


    validateAmount(amount) {
        amount = new BigNumber(amount);
        return !amount.gt(Const.MAX_DONATE);
    }

    setAmount(BTC,WRG) {
        var amount = {BTC,WRG};


        if (!this.validateAmount(WRG)) {
            var w = new BigNumber(Const.MAX_DONATE);
            var b = w.mul(this.props.exchangeRate).div(Const.WRG_UNIT);
            amount = {
                BTC:b,
                WRG: w
            };
        }

        this.setState(amount);
        Actions.changeAmount(amount);
        return amount;

    }
    
    onBTCChange(v) {
        v = v.replace(",",".");
        var BTC = new BigNumber(v);
        var wrg = BTC.mul(Const.WRG_UNIT).div(this.props.exchangeRate);
        return this.setAmount(v,wrg.toFixed(2).toString());
    }
    
    onWRGChange(v) {

        v = v.replace(",",".");
        var wrg = new BigNumber(v);
        var BTC = wrg.mul(this.props.exchangeRate).div(Const.WRG_UNIT);

        return this.setAmount(BTC.toString(),v);
    }
    
    render() {
        var BTC = this.state.BTC;
        var wrg = this.state.WRG;

        var cls = "col-xs-5 col-sm-4 col-md-4 col-lg-3" + (this.state.error ? " has-error": "");

        return (
             <div className="form-group">
                <label className="col-xs-12 col-sm-4 col-md-3 control-label" htmlFor="amountBTC">Amount</label>

                <div className={cls}>
                    <div className="input-group">
                        <span className="input-group-addon">WRG</span>
                        <input type="number" step="0.1" className="form-control" name="amountWRG" value={wrg}
                               onChange={ (e) => this.onWRGChange(e.target.value) } min="0" />
                    </div>
                    <div className="help-block"></div>
                </div>

                 <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 align-center">
                     <label className="control-label" style={{paddingTop:"8px"}}>{'='}</label>
                 </div>

                 <div className={cls}>
                     <div className="input-group tooltip-demo">
                         <span className="input-group-addon">BTC</span>
                         <input type="number" step="0.001" className="form-control" name="amount" value={BTC}
                                onChange={ (e) => this.onBTCChange(e.target.value) } />
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