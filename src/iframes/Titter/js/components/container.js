/**
 * Created by michbil on 25.05.17.
 */

import React from 'react';
const Loading = () => <img src="https://wrioos.com/Default-WRIO-Theme/img/loading.gif"/>;
import {getWebgoldUrl} from "../utils.js";
import FormState from '../stores/formstate.js';
import FormActions from '../actions/formactions.js';

const FreeWRGBlock = ({haveWallet,msg,getWRG}) => {
    const callback = haveWallet ? getWRG : () => window.open(getWebgoldUrl()+'/create_wallet','name','width=800,height=500');
    const buttonText = haveWallet ? "Get free Thanks coins" : "Create wallet and get free Thanks coins";
    return (
    <span id="faucetGroup">
        <span id="faucetMsg">{msg}</span>
        <a id="faucetButton"
           className="btn btn-sm btn-success"
           href="javascript:;"
           onClick={callback}><span
            className="glyphicon glyphicon-thumbs-up"></span>
            <span id="faucetText">{buttonText}</span>
            <Loading />
        </a>
        <a className="btn btn-link" href="https://wrioos.com/#Thanks_coins_(THX)" target="_parent">
            What are Thanks coins?</a>
    </span>);
};


const BalancePane = ({wrg,rtx,haveWallet,faucetMsg}) => {
    return (<div className="well" id="balancePane">
        <h4 id="balancestuff">Current balance&nbsp;
            <span id="wrgBalance">{wrg}</span>
            <small className="currency">THX</small>
        </h4>
        <p>You can receive 10 THX every hour free of charge</p>

        <p>Rating <span id="rtx">{rtx}</span></p>
        <br />
        <FreeWRGBlock haveWallet={haveWallet}
                      msg={faucetMsg}
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

const SendButton = ({user,busy,sendCB}) => {

    let text = user ? "Send" : "Login and submit";
    if (busy) {
        text = "Sending...";
    }
    const cb = user ? sendCB : () => {
        saveDraft();
        openAuthPopup();
    };
    const btn = (<button type="button" className={`btn btn-primary ${busy ? "disabled" : ""}`} onClick={cb}>
            <span className="glyphicon glyphicon-ok"></span>
            {busy && <Loading />}
            {text}
        </button>);

    return (<div className="pull-right">
        <label className="comment-limit">1024</label>
        {btn}
    </div>);

};

const DonatedAmount = ({amount}) => {
    return (<div className="alert alert-success" id="donatedStats">
        <button type="button" className="close" data-dismiss="alert">×</button>
        <span id="donatedAmount">{amount}</span>
    </div>);
};

class DonationForm extends React.Component {
    render() {
        return (<div>
            <div
                className="form-group send-comment-form-donation donation-form col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <div className="input-group input-group-sm tooltip-demo">
                    <span className="input-group-addon">Donation</span>
                    <input type="number"
                           className="form-control"
                           ref="inputAmount"
                           value={this.props.amount}
                           min="0"
                           onChange={() => FormActions.amountChanged(this.refs.inputAmount.value)} /><span
                    className="input-group-addon">THX</span>
                </div>

                <div className="help-block">
                    <span>Insufficient funds</span>
                </div>
            </div>
            <div className="form-group send-comment-form-donation col-xs-12 col-sm-6 col-md-4 col-lg-7">
                <div className="input-group input-group-sm">
                    <span className="input-group-addon twitter-limit">72</span>
                    <input ref="title"
                           name="tweet_title"
                           className="form-control"
                           maxLength="72"
                           placeholder="Title, hashtags or mentions. Max 72 characters" type="text"
                           value={this.props.tags}
                           onChange={() => FormActions.tagsChanged(this.refs.title.value)}/>
                </div>
            </div>

            <div className="form-group send-comment-form col-xs-12">
                        <textarea maxLength="1024"
                                  rows="3"
                                  className="form-control"
                                  placeholder="Let us know your thoughts! Max 1024 characters"
                                  name="comment"
                                  ref="comment"
                                  value={this.props.comment}
                                  onChange={() => FormActions.commentChanged(this.refs.comment.value)}>
                        </textarea>
            </div>
        </div>);
    }
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
                <form encType="multipart/form-data" method='POST' action="/sendComment"
                      className="margin-bottom form-send-comment" role="form">
                    {this.state.showBalance && <BalancePane wrg={this.state.balance} rtx={this.state.rtx}/>}
                    {/*<DonatedAmount amount={0}/>*/}
                    <ErrorBox noAuthor={this.state.noAuthor}
                              noWebgold={this.state.noWebgold}
                              noAuthorWallet={this.state.noAuthorWallet} />
                    <DonationForm amount={this.state.amount} tags={this.state.tags} comment={this.state.comment}/>

                    <div className="form-group send-comment-form col-xs-12">
                        <div style={{height:"0px",overflow:"hidden"}}>
                            <input type="file" accept="image/*" multiple id="fileInput" name="fileInput"/>
                        </div>
                        <div className="pull-left">
                            <button type="button" className="btn btn-default" onClick={()=>{
                             $("#fileInput").click();
                            }}>
                                <span className="glyphicon glyphicon-camera"></span>
                                Photo
                            </button>
                        </div>
                        <SendButton sendCB={()=>FormActions.sendComment()}/>
                    </div>
                </form>
            </div>

        );
    }

};
export default Container;