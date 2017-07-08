/**
 * Created by michbil on 04.05.17.
 */
import React from 'react'
import KeyStore from '../../crypto/keystore.js'
import lightwallet from 'eth-lightwallet'

async function saveToLocalStorage(id,seed,password) {
    let store = new KeyStore();
    let {ks} = await store.extractKey(seed,password);
    let serialized = await ks.serialize();
    if (window.localStorage) {
        localStorage.setItem('keystore'+id,serialized);
        return ks;
    } else {
        throw new Error("No localStorage available");
    }
}

async function getFromLocalStorage(id,password) {
    if (window.localStorage) {
        const serialized = localStorage.getItem('keystore'+id);
        if (!serialized) return null;
        let store_d = new KeyStore();
        store_d.deserialize(serialized);

        return await store_d.extractKey(null,password,store_d.keystore)
    } else {
        throw new Error("No localStorage available");
    }
}






const PassPhraseEntry = ({header,backCallback,forwardCallback,error}) => {
    let input;

    return ( <div className="form-horizontal">
      {header}
      <br />
      <div className="form-group form-inline">
        <label for="id-Passphrase" className="col-xs-12 col-sm-4 col-md-3 control-label">12 word seed</label>
        <div className="col-xs-12 col-sm-8 col-md-9">
          <input className="col-xs-12 form-control" ref={node => {
                input = node;
          }} placeholder="Enter your 12 word seed"></input>
          <br />
          {error !== ""? <h5 className="breadcrumb danger">{error}</h5> : ""}
        </div>
      </div>
      <div className="col-xs-12">
        <a onClick={backCallback} className="btn btn-default"><span className="glyphicon glyphicon-arrow-left"></span>Back</a>
        <div className="pull-right">
          <a href="#" className="btn btn-primary" onClick={() => forwardCallback(input.value)}><span className="glyphicon glyphicon-ok"></span>Verify</a>
        </div>
      </div>
    </div>);
};


/** Current class helps user to get keystore either by loading from the localStorage or by entering passphrase directly
 *
 *
 * */

export default class ObtainKeystore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noKeyInStorage: false,
            error: ""
        };
        this.verify = this.verify.bind(this);
    }

    async componentDidMount () {
        let ks = await getFromLocalStorage(this.props.id,'123');
        if (ks == null) {
            this.setState({
                noKeyInStorage: true
            });
        } else {
            this.props.confirmCallback(ks.ks);
        }
    }

    async verify (seed) {
        //  const pass = this.refs.passphrase.value;
        seed = seed.replace(/\s+/g, " "); // strip excess whitespaces
        if (!lightwallet.keystore.isSeedValid(seed)) {
            this.setState({error:"You've entered invalid seed. Your seed should be 12 words separated by spaces."});
        } else {
            if (this.props.verifyFunc) {
                if (!this.props.verifyFunc(seed)) {
                    return this.setState({error:"You've entered wrong seed"});
                }
            }
            let ks = await saveToLocalStorage(this.props.id,seed,'123');
            this.props.confirmCallback(ks);
        }

    }

    render () {

        if (this.state.noKeyInStorage) {
            return (<div>

                <PassPhraseEntry header={this.props.header}
                                    error={this.state.error}
                                    backCallback={this.props.backCallback}
                                    forwardCallback={this.verify}
                /></div>);

        } else {
            return (<img src="https://default.wrioos.com/img/loading.gif"/>);
        }

    }


}

ObtainKeystore.propTypes = {
    id: React.PropTypes.string,
    header: React.PropTypes.any,
    backCallback: React.PropTypes.func,
    confirmCallback: React.PropTypes.func,
    verifyFunc: React.PropTypes.func
};
