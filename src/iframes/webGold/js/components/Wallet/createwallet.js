import React from 'react';
import KeyStore from '../../crypto/keystore.js';
import ExtraEntropy from './ExtraEntropy.js';
import Disclaimer from './Disclaimer.js';
import {saveEthereumId} from '../../libs/apicalls.js';
import ObtainKeystore from './ObtainKeystore.js';

const PASSPHRASE = "dummy";

const ConfirmationHeader = (<div className="content col-xs-12">
  <div className="margin">
    <ul className="breadcrumb"><li className="active">Confirmation</li></ul>
    <div className="callout">
      <p>To confirm you've written down your seed correctly, please type it here:</p>
    </div>
  </div>
</div>);

export default class CreateWallet extends React.Component {

    constructor (props) {
        super(props);
        const saveEthId = (addr) => saveEthereumId("0x"+addr).then(()=> {

            window.opener.postMessage(JSON.stringify({
                "reload": true
            }), "*");
            window.close();
        }).catch((err)=>console.warn("error saving",err));
        this.state = {
            entropy: "",
            walletCode: null,
            enterEntropy: true,
            saveCB: this.props.saveCB ? this.props.saveCB : saveEthId
        };

    }


    generateSeed() {
        const entropy = this.state.entropy;
        this.randomSeed = KeyStore.generateSeed(entropy);
        console.log(this.randomSeed);
        this.setState({
            walletCode: this.randomSeed
        });
    }

    gotEntropy(e) {
        this.setState({entropy: e,enterEntropy:false});
        this.generateSeed();
    }

    newWallet() {
        let cs = new KeyStore();
        cs.extractKey(this.randomSeed,'123').then(({addr})=>{
            this.setState({
                address: addr
            });
            this.state.saveCB(addr); // lets run save callback
        }).catch((err) =>console.warn("Unable to create a new address!",err));
    }


    render () {
        if (this.state.enterEntropy) {
            return ( <div>
                <ExtraEntropy cb={this.gotEntropy.bind(this)} />
            </div>)
        }
        if (this.state.verifyStage) {
            return  (< ObtainKeystore id={this.props.wrioID}
                                     verifyCallback={(seed) => seed == this.state.walletCode}
                                     header={ConfirmationHeader}
                                     confirmCallback={(ks) =>  this.newWallet()}
                                     backCallback={()=>this.setState({verifyStage: false})} />);
            //return (<VerifyForm callback={this.verifyCallback.bind(this)} backCallback={()=>this.setState({verifyStage: false})}/>);
        }
        return (<div className="content col-xs-12">
          <div className="margin">
            <ul className="breadcrumb"><li className="active">Wallet seed</li></ul>
            <div className="form-horizontal">
              <Disclaimer />
              {this.state.walletCode && <div className="form-group form-inline">
                <div className="col-xs-12">
                  <div className="alert alert-warning">{this.state.walletCode}</div>
                </div>
              </div>}
              <div className="col-xs-12">
                <div className="pull-right">
                  <a href="#" className="btn btn-success" onClick={() => this.setState(({ verifyStage:true}))}><span className="glyphicon glyphicon-ok"></span>I'm ready, continue!</a>
                </div>
              </div>
            </div>
          </div>
        </div>);
    }
 };
