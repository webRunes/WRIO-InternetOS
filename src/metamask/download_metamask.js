import React from 'react';

const getMetaMaskInstallLink = require('./get_metamask_install_link');
const link = getMetaMaskInstallLink();

const white = 'https://raw.githubusercontent.com/MetaMask/faq/master/images/download-metamask.png';
const black = 'https://raw.githubusercontent.com/MetaMask/faq/master/images/download-metamask-dark.png';

class DownloadMetaMask extends React.Component {
  state = {
    img: white
  }

  render() {
    return (
      <a href={link} target='_blank'>
        <img
          src={this.state.img}
          onMouseEnter={() => this.setState({img: black})}
          onMouseOut={() => this.setState({img: white})}
        />
      </a>
    )
  }
}

export default DownloadMetaMask;
