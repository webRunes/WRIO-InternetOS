import React from 'react';

export default class VerifyForm extends React.Component {
    constructor(props) {
        super(props);
    }

    verify () {
      //  const pass = this.refs.passphrase.value;
        const seed = this.refs.seed.value.replace(/\s+/g, " "); // strip excess whitespaces
        //console.log(pass,seed);
        this.props.callback(seed);
    }

    goBack(e) {
        console.log("Going back",e);
        this.props.backCallback()
    }

    render () {
        return (<div className="content col-xs-12">
          <div className="margin">
            <ul className="breadcrumb"><li className="active">Confirmation</li></ul>
            <div className="callout">
              <p>To confirm you've written down your seed correctly, please type it here:</p>
            </div>
            <div className="form-group form-inline">
              <label for="id-Passphrase" className="col-xs-12 col-sm-4 col-md-3 control-label">12 word seed</label>
              <div className="col-xs-12 col-sm-8 col-md-9">
                <input className="col-xs-12 form-control" ref="seed" placeholder="Enter your 12 word seed"></input>
              </div>
            </div>
            { /* <div className="form-group form-inline">
                <label for="id-Passphrase" className="col-sm-4 col-md-3 control-label">Password</label>
                <div className="col-sm-8 col-md-9">
                    <input className="form-control" type="password" ref="passphrase" placeholder="Enter password" size="80"></input>
                </div>
            </div>*/}
            <div className="col-xs-12">
              <a onClick={this.goBack.bind(this)} className="btn btn-default"><span className="glyphicon glyphicon-arrow-left"></span>Back</a>
              <div className="pull-right">
                <a href="#" className="btn btn-success" onClick={this.verify.bind(this)}><span className="glyphicon glyphicon-ok"></span>Finish</a>
              </div>
            </div>
          </div>
        </div>);
    }
}
