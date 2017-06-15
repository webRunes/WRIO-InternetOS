/**
 * Created by michbil on 13.06.17.
 */

import React from 'react';
import request from 'superagent';
import moment from 'moment';
import Const from '../../../constant.js';
const SATOSHI = Const.SATOSHI;


export default class Donations extends React.Component {


    constructor(props) {
        console.log("Balances created");
        super(props);

        this.state = {
            data:[

            ]
        };
    }

    requestUsers(cb) {
        request.get('/api/webgold/coinadmin/donations').end((err,users)=> {
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
                <h2>WRG donations list</h2>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Amount</th>
                        <th>Timestamp</th>
                        <th>Success</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {

                            return  (<tr>
                                <td>{ item.srcWrioID }</td>
                                <td>{ item.destWrioID }</td>
                                <td>{ item.amount / 100 }</td>
                                <td>{  moment(item.timestamp).format("H:mm:ss DD.MM.YYYY") }</td>
                                <td></td>
                            </tr>);
                        })}

                    </tbody>
                </table>
            </div>

        );
    }
}
