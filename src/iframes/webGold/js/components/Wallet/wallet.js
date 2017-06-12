import React from 'react';
import KeyStore from '../../crypto/keystore.js';
import Tx from 'ethereumjs-tx';
import {getEthereumId,sendSignedTransaction} from '../../libs/apicalls.js';
import extractUrlParameter from '../../libs/url.js';
import lightwallet from 'eth-lightwallet'
import ObtainKeystore from './ObtainKeystore.js';
/*

 Sample transaction, first nonce should be '0x100000' for the testnet

sampleTransaction(addr) {
    const tx = {
        nonce: '0x100000',
        gasPrice: '0x0df8475800',
        gasLimit: '0x0651cf',
        value: '0x00',
        to: '0x61bb0b7df66ab82880c032401a5deb218f8faf3a',
        data: '0xe69d849d000000000000000000000000e8ac9e205afebc8d038116e383a63b60120b8a750000000000000000000000000000000000000000000000000000000000002af8'
    };
    this.tx = txutils.createContractTx(addr, tx).tx;
}
*/

let ks = new KeyStore();


const ExtractKeyHeader = (wrioID) => {
    return (<div className="callout">
      <h5>Confirmation</h5>
      <p>To confirm transaction please enter your seed for account {wrioID}.</p>
    </div>);
};

const ApproveReject = ({onApprove,onReject}) => {
    return (<div className="col-xs-12">
      <div className="pull-right">
        <a onClick={onReject} className="btn btn-default"><span className="glyphicon glyphicon-remove"></span>Cancel</a>
        <a href="#" className="btn btn-success" onClick={onApprove}><span className="glyphicon glyphicon-ok"></span>Send</a>
      </div>
    </div>);
}


export default class EthWallet extends React.Component {

    constructor (props) {
        super(props);
        this.tx = this.props.tx;
        console.log("TX to sign",this.tx);
        if (!this.tx) throw new Error("TX not specified!");

        window.txA = this.dbgTransaction(this.tx);
        this.state = {
            finished: false,
            busy: false,
            error: "",
            approveStage: false
        };
    }

    componentDidMount() {

    }

    dbgTransaction(tx) {
        var stx = new Tx(tx);
        console.log("Validating signed transaction...",stx.validate(),stx.verifySignature());
        console.log(stx.toJSON());
        console.log(stx);
        return stx;
    }

    sendSignedTransaction (tx) {
        const txId = extractUrlParameter('id');
        sendSignedTransaction(tx,txId).then((res)=>{
            this.setState({
                error: "",
                busy: false,
                finished: true,
                txId:res.text,
                txUrl: 'https://ropsten.etherscan.io/tx/'+res.text
            });
            okGO=true;
            window.opener.postMessage(JSON.stringify({closePopup:true, txId:res.text}),'*');
            console.log('transaction sent');
            setTimeout(window.close,2000);
        }).catch((err)=> {
            console.log(err);
            this.setState({error: "Oops, something went wrong during transaction processing"});
            window.opener.postMessage(JSON.stringify({closePopup:true, error: err}),'*');
            setTimeout(window.close,2000);
        });
    }


    signTX(keystore) {
        ks.extractKey(null,'123',keystore).then(ks.signTx(this.tx)).then((signed) => {
            this.sendSignedTransaction(signed);
            this.dbgTransaction(signed);
            this.setState({busy:true})
        }).catch((err) => {
            this.setState({error: "There seems to have been an error initializing your transaction."});
            console.log(err);
        });
    }


    checkCreds(keystore) {
        ks.extractKey(null,'123',keystore).
            then(ks.verifySeedAgainstEthId(this.props.ethID)).
            then((result) => {
                if (!result) {
                    this.setState({error:"The seed you entered does not match your account."});
                } else {
                    this.setState({
                        approveStage: true,
                        keystoreSaved: keystore
                    });
                }
            }).catch((err)=>{
                this.setState({error:"Keystore init error."});
                console.log("Keystore init error.",err);
            });
    }

    render() {
        const openPopup = () => window.open('/create_wallet','name','width=600,height=400');
        if (this.state.busy) {
            return (<div className="content col-xs-12">
              <div className="margin">
                <ul className="breadcrumb"><li className="active">Transaction is being processed</li></ul>
                <p className="col-xs-12">
                  {this.state.error !== ""? <h5 className="breadcrumb danger">{this.state.error}</h5> : ""}
                  <img src="https://default.wrioos.com/img/loading.gif"/>
                </p>
              </div>
            </div>)
        }
        return (
            <div>
              { this.props.ethID ? this.renderUnlock() : <a href="javascript:;" target="popup" onClick={openPopup}>Please register your Ethereum wallet</a> }
            </div>
        );
    }

    renderUnlock () {
        if (this.state.finished) {
            return (<div className="content col-xs-12">
              <div className="margin">
                <ul className="breadcrumb"><li className="active">Success!</li></ul>
                <p className="col-xs-12">Transaction has been sent successfully. Transaction hash <a href={this.state.txUrl} target="_blank">{this.state.txId}</a></p>
              </div>
            </div>);
        }
        return (<div className="content col-xs-12">
          <div className="margin">
            <ul className="breadcrumb"><li className="active">Confirm transaction</li></ul>
            <p className="col-xs-12"><br />Transfer of {this.props.amount / 100} THX to user ID <a href={`https://wr.io/${this.props.to}/index.html`} target="_blank">{this.props.to}</a></p>
            {this.state.error !== ""? <h5 className="breadcrumb danger">{this.state.error}</h5> : ""}

            { this.state.approveStage ? <ApproveReject onApprove={()=>{
              this.signTX(this.state.keystoreSaved);
            }} onReject={()=>{
              window.opener.postMessage(JSON.stringify({closePopup:true, error: "Rejected by user"}),'*');
              window.close();
            }} /> :
              < ObtainKeystore id={this.props.wrioID}
              header={ExtractKeyHeader(this.props.wrioID)}
              confirmCallback={(ks) => this.checkCreds(ks)}
              backCallback={()=>console.log('back')} />
            }
          </div>
        </div>);
    }


}
