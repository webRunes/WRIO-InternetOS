/**
 * Created by michbil on 18.04.16.
 */
import React from 'react';

export default class BalanceLine extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<li>
            <span>{this.props.label}</span>
                        <span>
                            { this.props.wrg }<small className="currency">WRG</small>
                            <sup className="currency">
                                <span ref="usdBalance">{ this.props.usd }</span><span className="currency">USD</span>
                            </sup>
                        </span>
        </li>);
    }

}

BalanceLine.propTypes = {
    label: React.PropTypes.string,
    wrg: React.PropTypes.any,
    usd: React.PropTypes.any
};