/**
 * Created by michbil on 13.06.17.
 */
import React from 'react';
import request from 'superagent';
import moment from 'moment';
import Const from '../../../constant.js';
const SATOSHI = Const.SATOSHI;

import numeral from 'numeral';

export default class Emissions extends React.Component {


    constructor(props) {
        console.log("Balances created");
        super(props);

        this.state = {
            data:[

            ]
        };
    }

    requestUsers(cb) {
        request.get('/api/webgold/coinadmin/emissions').end((err,users)=> {
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
                <h2>WRG emission list</h2>
                <p>List of newly emitted WRG's</p>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>WRIOID</th>
                            <th>Amount</th>
                            <th>Timestamp</th>

                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.data.map(function (item) {

                                return  (<tr>
                                    <td>{ item.userID }</td>
                                    <td>{ item.amount / 100 }</td>
                                    <td>{  moment(item.timestamp).format("H:mm:ss DD.MM.YYYY")  }</td>

                                </tr>);
                            })}

                        </tbody>
                    </table>
            </div>

        );
    }
}