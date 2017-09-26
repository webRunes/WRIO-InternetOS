/**
 * Created by michbil on 13.06.17.
 */
import React from 'react';
import moment from 'moment';
import Const from '../../../constant.js';
import PropTypes from 'prop-types'
const SATOSHI = Const.SATOSHI;


export default class PrePayments extends React.Component {


    constructor(props) {
        console.log("Balances created");
        super(props);

        this.state = {
            data:props.data
        };
    }


    render() {
        return (
            <div>
                <p>List of deferred payments, when user have 0 WRG balance</p>
                <table className="table">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>TO</th>
                        <th>AMOUNT</th>

                        <th>TIMESTAMP</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {

                            return  (<tr>
                                <td>{ item.id }</td>
                                <td>{ item.to }</td>
                                <td>{ item.amount / 100 }</td>
                                <td>{ moment(item.timestamp).format("H:mm:ss DD.MM.YYYY") }</td>
                            </tr>);
                        })}

                    </tbody>
                </table>
            </div>

        );
    }
}

PrePayments.propTypes = {
    data: PropTypes.object
};
