/**
 * Created by michbil on 18.04.16.
 */
import React from 'react';
import PropTypes from 'prop-types'

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
    label: PropTypes.string,
    wrg: PropTypes.any,
    usd: PropTypes.any
};