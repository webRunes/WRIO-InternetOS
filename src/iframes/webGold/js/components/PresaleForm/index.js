import React from 'react';
import Amount from './Amount';
import Alert from './Alert';
import BincoinForm from './BitcoinForm';
import PaymentStore from '../../stores/PaymentStore';
import PaymentData from "./PaymentData";
import request from 'superagent';
import Const from '../../../../constant.js';
import EmailEntry from './EmailEntry.js';
import CreateWallet, {Disclaimer} from '../Wallet/createwallet.js';

let SATOSHI = Const.SATOSHI;
var recapEvent = null;

export default class PresaleForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: null,
            payment_data: null,
            amount: 0.0,
            showPaymentCredentials:false,
            showWallet: false,
            stage: 0
        };
        recapEvent = this.recapReady.bind(this);
    }

    changeAmount(status) {
       this.setState({amount: status.amount});
    }

    componentDidMount() {
        this.unsubscribe = PaymentStore.listen( status => this.changeAmount(status));
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    gotEmail(err, mail) {
        if (!err) {
            this.setState({email: mail});
        }
    }

    gotAddr(addr) {
        this.setState({id: addr,
            showPaymentCredentials: true,
            showWallet:false});
    }

    addFunds(e) {
        e.preventDefault();

        let form = e.target;

        request
            .post('/api/blockchain/request_presale')
            .set('X-Requested-With',"XMLHttpRequest")
            .send({
                amount: parseFloat(form.amount.value)*SATOSHI,
                amountWRG: parseFloat(form.amountWRG.value),
                mail: this.state.email,
                ethID: this.state.id,
                "g-recaptcha-response":this.state.captcha
            })
            .end((err, res) => {
                if (err) {
                    return this.setState({
                        alert: {
                            type: 'error',
                            message: 'Error: ' + err.message
                        }
                    });
                }

                var result = JSON.parse(res.text);
                this.setState({
                    showPaymentCredentials: false,
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

    recapReady(captcha) {
        console.log("reCaptcha successfully submitted");
        this.setState({showWallet: true,captcha: captcha,stage: 2});
    }

    showCaptcha() {
        this.setState({stage:1});

    }
    componentDidUpdate() {
        if (this.state.stage == 1) {
            grecaptcha.render('googleRecaptcha',{
                'sitekey':'6Lc6rQoUAAAAACmUxcn9AwYbrMEAFCEx8ZWOE8uF',
                'callback': this.recapReady.bind(this)
            });
        }
    }
    render() {

        if (this.state.payment_data) {
            setTimeout(frameReady,600); // TODO using global function, this is wrong, make properly next time
        }

        return (
          <form name="presaleForm" onSubmit={this.addFunds.bind(this)}>

              {this.state.stage == 0 && <div className="well enable-comment">
                  <h4>Get your first crypto currency wallet!</h4>
                  <p>Press "Create Wallet" to get your first crypto-wallet that will open a door into the world of financial independence. No control, ID or verification will be required of you.</p>
                  <br />
                  <a className="btn btn-sm btn-success" onClick={()=>this.showCaptcha()}><span className="glyphicon glyphicon-ok-sign"></span>Create wallet</a>
              </div>}

              {this.state.stage == 1 && <div className="col-xs-12" >
                  <div className="col-xs-12 col-sm-3 col-md-3 col-lg-2"><label className="control-label">Prove you're not a robot</label></div>
                  <div id="googleRecaptcha" className="g-recaptcha"></div>
                </div>}

              {this.state.showWallet ? <div className="col-xs-12" >
                    <CreateWallet saveCB={this.gotAddr.bind(this)}/>
                </div> : "" }

              { this.state.payment_data ? <PaymentData
                  amount= {this.state.payment_data.amount / SATOSHI}
                  adress= {this.state.payment_data.adress}
                  /> : '' }


              {this.state.showPaymentCredentials ?
                  <div className="form-horizontal col-xs-12">
                      <div className="callout">
                          <h5>Enter your email and desired amount</h5>
                          <p></p>
                      </div>
                      <br />
                  <EmailEntry gotMail={this.gotEmail.bind(this)} />
                      <Amount exchangeRate={ this.props.exchangeRate } />
                      <br />
                      <div className="col-xs-12">
                            <div className="pull-right">
                                <button className="btn btn-success" >
                                    <span className="glyphicon glyphicon-thumbs-up"></span>Continue
                                </button>
                            </div>
                      </div>
               </div> : ""}


            </form>
        );
    }
}
PresaleForm.propTypes = {
    loginUrl: React.PropTypes.string.isRequired,
    exchangeRate: React.PropTypes.object
};

