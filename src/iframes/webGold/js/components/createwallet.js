import React from "react";
import KeyStore from "../crypto/keystore.js";
import ExtraEntropy from "./ExtraEntropy.js";
import Disclaimer from "./Disclaimer.js";
import VerifyForm from "./VerifyForm.js";
import { saveEthereumId } from "../libs/apicalls.js";

const PASSPHRASE = "dummy";

export default class CreateWallet extends React.Component {
  constructor(props) {
    super(props);
    const saveEthId = addr =>
      saveEthereumId("0x" + addr)
        .then(() => {
          window.opener.postMessage(
            JSON.stringify({
              reload: true
            }),
            "*"
          );
          window.close();
        })
        .catch(err => console.warn("error saving", err));
    this.state = {
      entropy: "",
      walletCode: null,
      enterEntropy: true,
      verifyStage: false,
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

  newWallet() {
    let cs = new KeyStore();
    cs
      .extractKey(this.randomSeed, "123")
      .then(({ addr }) => {
        this.setState({
          address: addr
        });
        this.state.saveCB(addr); // lets run save callback
      })
      .catch(err => console.warn("Unable to create a new address!", err));
  }

  gotEntropy(e) {
    this.setState({ entropy: e, enterEntropy: false });
    this.generateSeed();
  }

  verifyCallback(seed, pass) {
    // const passphrase = this.state.passphrase;
    const wallet = this.state.walletCode;
    if (seed === wallet) {
      this.newWallet();
    } else {
      alert("Please verify that you entered everything correctly");
    }
  }

  render() {
    if (this.state.enterEntropy) {
      return (
        <div>
          <ExtraEntropy cb={this.gotEntropy.bind(this)} />
        </div>
      );
    }
    if (this.state.verifyStage) {
      return (
        <VerifyForm
          callback={this.verifyCallback.bind(this)}
          backCallback={() => this.setState({ verifyStage: false })}
        />
      );
    }
    return (
      <div className="form-horizontal">
        <Disclaimer />
        <br />
        {this.state.walletCode && (
          <div className="form-group form-inline">
            <div className="col-sm-12">
              <div className="alert alert-warning">{this.state.walletCode}</div>
            </div>
          </div>
        )}
        <br />

        <div className="col-xs-12">
          <div className="pull-right">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => this.setState({ verifyStage: true })}
            >
              <span className="glyphicon glyphicon-ok" />Create new wallet
            </a>
          </div>
        </div>
      </div>
    );
  }
}

class PasswordEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passphrase: "",
      passphrase2: ""
    };
  }

  confirmPass() {
    const passphrase = this.refs.passphrase.value;
    const passphrase2 = this.refs.passphrase2.value;

    if (passphrase !== passphrase2) {
      alert("Passwords don't match");
      return;
    }
    if (passphrase === "") {
      return alert("Password can't be blank!");
    }

    this.setState({
      verifyStage: true,
      passphrase: passphrase,
      passphrase2: passphrase2
    });
  }

  render() {
    return (
      <div>
        <div className="form-group form-inline">
          <label
            for="id-Passphrase"
            className="col-sm-4 col-md-3 control-label"
          >
            Create Password
          </label>
          <div className="col-sm-8 col-md-9">
            <input
              className="form-control"
              type="password"
              ref="passphrase"
              placeholder="Enter password"
              size="80"
            />
          </div>
        </div>
        <div className="form-group form-inline">
          <label
            for="id-Passphrase"
            className="col-sm-4 col-md-3 control-label"
          >
            Repeat password
          </label>
          <div className="col-sm-8 col-md-9">
            <input
              className="form-control"
              type="password"
              ref="passphrase2"
              placeholder="Repeat password"
              size="80"
            />
          </div>
        </div>
      </div>
    );
  }
}
