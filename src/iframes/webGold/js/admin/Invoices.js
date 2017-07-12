/**
 * Created by michbil on 13.06.17.
 */

import React from 'react';
import request from 'superagent';
import moment from 'moment';
import Const from '../../../constant.js';
const SATOSHI = Const.SATOSHI;

import numeral from 'numeral';

export default class Invoices extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[]
        };
    }

    componentDidMount() {
        console.log("Mounted");
        request.get('/api/webgold/coinadmin/invoices').end((err,res) => {
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
                <h1>Registered invoices</h1>

                <table className="table">
                    <thead>
                    <tr>
                        <th>Wrio ID</th>
                        <th>Bitcoin Adress</th>
                        <th>Amount</th>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {
                            var amount = (item.amount || item.requested_amount)/SATOSHI;
                            if (isNaN(amount)) {
                                amount = "Error";
                            } else {
                                amount = numeral(amount).format('0.00000000') + " BTC";
                            }
                            return  (<tr>
                                <td> {item.wrioID}</td>
                                <td>{ item.input_address }</td>
                                <td>{ amount }</td>
                                <td>{ moment(item.timestamp).format("H:mm:ss DD.MM.YYYY")  }</td>
                                <td>{ item.state}</td>
                            </tr>);
                        })}

                    </tbody>
                </table>
            </div>
        );
    }
}
