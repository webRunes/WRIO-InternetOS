import React from "react";

export default class VerifyForm extends React.Component {
  constructor(props) {
    super(props);
  }

  verify() {
    //  const pass = this.refs.passphrase.value;
    const seed = this.refs.seed.value.replace(/\s+/g, " "); // strip excess whitespaces
    //console.log(pass,seed);
    this.props.callback(seed);
  }

  goBack(e) {
    console.log("Going back", e);
    this.props.backCallback();
  }

  render() {
    return (
      <div className="form-horizontal">
        <div className="callout">
          <h5>Confirmation</h5>
          <p>
            To confirm you've written down your seed correctly, please type it
            here
          </p>
        </div>
        <br />
        <div className="form-group form-inline">
          <label
            for="id-Passphrase"
            className="col-sm-4 col-md-3 control-label"
          >
            12 word seed
          </label>
          <div className="col-sm-8 col-md-9">
            <input
              className="form-control"
              ref="seed"
              placeholder="Enter your 12 word seed"
              size="80"
            />
          </div>
        </div>
        {/* <div className="form-group form-inline">
                <label for="id-Passphrase" className="col-sm-4 col-md-3 control-label">Password</label>
                <div className="col-sm-8 col-md-9">
                    <input className="form-control" type="password" ref="passphrase" placeholder="Enter password" size="80"></input>
                </div>
            </div>*/}

        <div className="col-xs-12">
          <a onClick={this.goBack.bind(this)} className="btn btn-default">
            <span className="glyphicon glyphicon-arrow-left" />Back
          </a>
          <div className="pull-right">
            <a
              href="#"
              className="btn btn-primary"
              onClick={this.verify.bind(this)}
            >
              <span className="glyphicon glyphicon-ok" />Verify
            </a>
          </div>
        </div>
      </div>
    );
  }
}
