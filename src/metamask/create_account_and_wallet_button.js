import React from 'react';

const setProfileUrl = require('./set_profile_url');

class CreateAccountAndWalletButton extends React.Component {
  render() {
    const profile_url = 'http://wr.io/' + this.props.wrioID + '/index.html';

    return <a
      className="btn btn-sm btn-success"
      href="#"
      role="button"
      onClick={() => setProfileUrl(profile_url)}
    >
      Create account and wallet
    </a>
  }
}

export default CreateAccountAndWalletButton;
