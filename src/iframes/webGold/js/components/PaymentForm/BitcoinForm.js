/**
 * Created by michbil on 03.09.15.
 */
import React from 'react';
import Const from '../../../../constant.js';

let SATOSHI = Const.SATOSHI;

class BitcoinForm extends React.Component {
    render() {
        return (
            <div>
                <div>
                    Payment request created, please pay {this.state.BTC} to adress {this.state.address / SATOSHIc}
                </div>
            </div>
        );

    }
}
export default BitcoinForm;