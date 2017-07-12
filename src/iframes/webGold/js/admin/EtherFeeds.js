/**
 * Created by michbil on 13.06.17.
 */
import React from 'react';
import request from 'superagent';
import moment from 'moment';
import Const from '../../../constant.js';
const SATOSHI = Const.SATOSHI;

import numeral from 'numeral';

export default class EtherFeeds extends React.Component {


    constructor(props) {
        console.log("Balances created");
        super(props);

        this.state = {
            data:[

            ]
        };
    }

    requestUsers(cb) {
        request.get('/api/webgold/coinadmin/etherfeeds').end((err,users)=> {
            if (err) {
                cb(err);
                return;
            }
            cb(null,JSON.parse(users.text));
        });
    }

    componentWillMount() {
        var that = this;

        this.requestUsers((err,state) => {
            if (err) {
                alert('Cant get users \n'+err);
                return;
            }
            that.setState({
                data: state
            });
        });
    }

    render() {
        return (
            <div>
                <h2>Ether Feed list</h2>
                <p>Description: to ensure proper user account operation each accound is feeded with minimal ether amount to perform opartion. Each ether withdrawal by user is logged in this page</p>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Ethereum account</th>
                        <th>Timestamp</th>

                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {

                            return  (<tr>
                                <td>{ item.amount }</td>
                                <td>{ item.eth_account }</td>
                                <td>{  moment(item.timestamp).format("H:mm:ss DD.MM.YYYY")  }</td>
                            </tr>);
                        })}

                    </tbody>
                </table>
            </div>

        );
    }
}
