import { Promise } from "es6-promise";
import React from "react";
import request from "superagent";

class EthereumClient extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="callout">
        <h5>Ethereum status</h5>
        <p>WRG balance:</p>
        <p>Ethereum balance:</p>
      </div>
    );
  }
}

export default EthereumClient;
