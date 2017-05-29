import React from 'react';
import request from 'superagent';
import numeral from 'numeral';
import Const from '../../../../constant.js';

let SATOSHI = Const.SATOSHI;

class PaymentsHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[]
        };
    }

    componentDidMount() {
        console.log("Mounted");
        request.get('/api/blockchain/payment_history')
        .set('X-Requested-With',"XMLHttpRequest")
            .end((err,res) => {
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
               <h1>Pending payments</h1>
                <table className="table">
                    <thead>
                        <tr>
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
                            <td>{ item.input_address }</td>
                            <td>{ amount }</td>
                            <td>{ item.timestamp  }</td>
                            <td>{ item.state}</td>
                        </tr>);
                    })}

                    </tbody>
                </table>
            </div>
        );
    }
}

export default PaymentsHistory;