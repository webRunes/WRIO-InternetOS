/**
 * Created by michbil on 25.05.17.
 */

import React from 'react';
const Loading = () => <img src="https://wrioos.com/Default-WRIO-Theme/img/loading.gif"/>;
import FormState from '../stores/formstate.js';
import FormActions from '../actions/formactions.js';
import DonationForm from './DonationForm.js';
import FileEntry from './FileEntry'
import {getServiceUrl} from '../../../../base/servicelocator'

const FreeWRGBlock = ({haveWallet,msg,busy,minutesLeft}) => {
    const callback = haveWallet ? FormActions.requestFreeTHX : () => window.open(getServiceUrl('webgold')+'/create_wallet','name','width=800,height=500');
    let buttonText = haveWallet ? "Get free Thanks coins" : "Create wallet and get free Thanks coins";
    buttonText = minutesLeft == 0 ? buttonText : `Wait ${minutesLeft} minutes`;
    return (
    <span id="faucetGroup">
        <span id="faucetMsg">{msg}</span>
        <a id="faucetButton"
           className={`btn btn-sm btn-success ${(minutesLeft !== 0 || busy) && 'disabled'}`}
           href="javascript:;"
           onClick={callback}><span
            className="glyphicon glyphicon-thumbs-up "></span>
            <span id="faucetText">{buttonText}</span>
            {busy && <Loading />}
        </a>
        <a className="btn btn-link"
           onClick={()=> callback()}
           href="https://wrioos.com/#Thanks_coins_(THX)"
           target="_parent">
            What are Thanks coins?</a>
    </span>);
};


const BalancePane = ({wrg,rtx,haveWallet,faucet}) => {
    return (<div className="well" id="balancePane">
        <h4 id="balancestuff">Current balance&nbsp;
            <span id="wrgBalance">{wrg}</span>
            <small className="currency">THX</small>
        </h4>
        <p>You can receive 10 THX every hour free of charge</p>

        <p>Rating <span id="rtx">{rtx}</span></p>
        <br />
        <FreeWRGBlock haveWallet={haveWallet}
                      msg={faucet.faucetMsg}
                      minutesLeft={faucet.minutesLeft}
                      busy={faucet.busy}
            />
    </div>);
};

const ErrorBox = ({noAuthor,noAuthorWallet,noWebgold}) => {
    return ( <div className="margin-bottom" role="form">
        {noWebgold && <div id="nowebgold"  className="callout warning col-xs-12">
            <h4>We are experiencing technical difficulties with payment service. We are working to fix the problem.</h4>
        </div>}
        {noAuthor && <div className="callout warning col-xs-12" id="noAuthor">
            <h5>Author unknown</h5>
            <p>You can comment, but donations disabled</p>
        </div>}
        {noAuthorWallet && <div className="callout warning col-xs-12"  id="authorNoWallet">
            <h5>The author has no wallet</h5>
            <p>You can comment, but donations disabled</p>
        </div>}

    </div>);
};

const SendButton = ({user,busy,sendCB,commentLeft}) => {

    let text = user ? "Send" : "Login and submit";
    if (busy) {
        text = "Sending...";
    }
    const cb = user ? sendCB : () => {FormActions.openAuthPopup()};
    const btn = (<button type="button" className={`btn btn-primary ${busy ? "disabled" : ""}`} onClick={cb}>
            {busy ? <Loading /> :  <span className="glyphicon glyphicon-ok"></span> }
            {text}
        </button>);

    return (<div className="pull-right">
        <label className="comment-limit">{busy ? "Loading" : commentLeft }</label>
        {btn}
    </div>);

};

const ResultMessage = ({donateResultText,error}) => {
    return (donateResultText && <div className={"alert alert-success "+(!!error?"danger":"")} id="donatedStats">
        <button type="button" className="close" data-dismiss="alert">×</button>
        <span>{donateResultText}</span>
    </div>);
};


class Container extends React.Component {
    constructor(props) {
        super(props);
        this.listener = FormState.listen((s)=>this.getState(s));
        this.state = FormState.getInitialState();
    }
    componentWillUnmount() {
      this.listener();
    }
    getState(s) {
        this.setState(s);
    }
    render() {
        return (
            <div id="titter-id">
                <ResultMessage donateResultText={this.state.donateResultText} error={this.state.donateError}/>
                <form encType="multipart/form-data" method='POST' action="/sendComment"
                      className="margin-bottom form-send-comment" role="form">
                    {this.state.showBalance && <BalancePane wrg={this.state.balance}
                                                            rtx={this.state.rtx}
                                                            faucet={this.state.faucet}
                                                            haveWallet={this.state.haveWallet}/>}
                    {/*<DonatedAmount amount={0}/>*/}
                    <ErrorBox noAuthor={this.state.noAuthor}
                              noWebgold={this.state.noWebgold}
                              noAuthorWallet={this.state.noAuthorWallet} />
                    <DonationForm balance={this.state.balance}
                                  donateDisabled={this.state.donateDisabled}
                                  amount={this.state.amount}
                                  tags={this.state.tags}
                                  comment={this.state.comment}
                                  left={this.state.left}/>


                    <div className="form-group send-comment-form col-xs-12">
                        <FileEntry />
                        <SendButton user={this.state.user}
                                    busy={this.state.busy}
                                    sendCB={()=>FormActions.sendComment()}
                                    commentLeft={this.state.left.comment}
                            />
                    </div>
                </form>
            </div>

        );
    }
    componentDidUpdate() {
        window.frameReady();
    }
};
export default Container;