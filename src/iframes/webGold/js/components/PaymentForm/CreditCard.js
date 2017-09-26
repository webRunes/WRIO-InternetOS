import React from 'react';
import PropTypes from 'prop-types'

class CreditCard extends React.Component {
    render() {
        return (
            <div>
                <div className="form-horizontal col-xs-12">
                    <div className="col-xs-12 col-sm-3 col-md-3 col-lg-2">
                        <label className="col-sm-12 control-label" htmlFor="creditCard">Credit Card</label>
                    </div>

                    <div className="col-xs-6 col-sm-4 col-md-6 col-lg-6">
                        <div className="input-group input-group-sm tooltip-demo">
                            <input type="text" className="form-control"
                                name="creditCard" size="50"
                                value={ this.props.creditCard }
                                id="creditCard" maxLength="16"/>
                        </div>
                        <div className="help-block">Credit Card Number</div>
                    </div>
                </div>
                <div className="form-horizontal form-group col-xs-3 col-sm-12">
                    <div className="col-xs-12 col-sm-3 col-md-3 col-lg-2">
                        <label className="col-sm-12 control-label" htmlFor="month">Month</label>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-3">
                        <div className="input-group input-group-sm tooltip-demo">
                            <select
                                className="select2"
                                name="month"
                                data-stripe="exp-month"
                                defaultValue={ this.props.month } >
                                <option>01</option>
                                <option>02</option>
                                <option>03</option>
                                <option>04</option>
                                <option>05</option>
                                <option>06</option>
                                <option>07</option>
                                <option>08</option>
                                <option>09</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                            </select>
                        </div>
                        <div className="help-block">MM</div>
                    </div>
                </div>
                <div className="form-horizontal form-group col-xs-3 col-sm-12">
                    <div className="col-xs-12 col-sm-3 col-md-3 col-lg-2">
                        <label className="col-sm-12 control-label">Year</label>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-3">
                        <div className="input-group input-group-sm">
                            <select name="year" data-stripe="exp-year" defaultValue={ this.props.year }>
                                <option>2015</option>
                                <option>2016</option>
                                <option>2017</option>
                                <option>2018</option>
                                <option>2019</option>
                                <option>2020</option>
                                <option>2021</option>
                            </select>
                        </div>
                        <div className="help-block">YY</div>
                    </div>
                </div>
                <div className="form-horizontal form-group col-xs-12">
                    <div className="col-xs-12 col-sm-3 col-md-3 col-lg-2">
                        <label className="col-sm-12 control-label" htmlFor="cvv">CVV</label>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-3">
                        <div name="cvv" className="input-group input-group-sm tooltip-demo">
                            <input
                                type="text" className="form-control" name="cvv"
                                size="3" defaultValue={ this.props.cvv } id="txtCVV"/>
                        </div>
                        <div className="help-block">CVV</div>
                    </div>
                </div>
            </div>
        );
    }
}

CreditCard.propTypes = {
    creditCard: PropTypes.number,
    month: PropTypes.number,
    year: PropTypes.number,
    cvv: PropTypes.number
};

CreditCard.defaultProps = {
    creditCard: 4242424242424242,
    month: 12,
    year: 2015,
    cvv: 789
};

export default CreditCard;