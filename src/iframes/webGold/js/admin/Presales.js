/**
 * Created by michbil on 13.06.17.
 */
import React from "react";
import request from "superagent";
import moment from "moment";
import Const from "../../../constant.js";
const SATOSHI = Const.SATOSHI;

import numeral from "numeral";

export default class Presales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    console.log("Mounted");
    request.get("/api/webgold/coinadmin/presales").end((err, res) => {
      if (err || !res) {
        console.log("Can't get payment history");
        return;
      }
      this.setState({
        data: res.body
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Registered presales</h1>

        <table className="table">
          <thead>
            <tr>
              <th>Ethereum ID</th>
              <th>BTC Adress</th>
              <th>BTC Amount</th>
              <th>Time</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(function(item) {
              var amount = (item.amount || item.requested_amount) / SATOSHI;
              if (isNaN(amount)) {
                amount = "Error";
              } else {
                amount = numeral(amount).format("0.00000000") + " BTC";
              }
              return (
                <tr>
                  <td> {item.ethID || ""}</td>
                  <td>{item.address || ""}</td>
                  <td>{amount || ""}</td>
                  <td>{moment(item.timestamp).format("H:mm:ss DD.MM.YYYY")}</td>
                  <td>{item.email || ""}</td>
                  <td>{item.state || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
