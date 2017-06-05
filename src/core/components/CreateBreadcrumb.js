import React from 'react';
import {getServiceUrl,getDomain} from '../servicelocator.js';
import WrioDocument from '../store/WrioDocument.js';

var domain = getDomain();

export default React.createClass({
    propTypes: {
        editMode: React.PropTypes.bool.isRequired,
        onEditClick: React.PropTypes.func.isRequired,
        onReadClick: React.PropTypes.func.isRequired,
        editAllowed: React.PropTypes.bool.isRequired,
        actionButton: React.PropTypes.any
    },

    clickTransactions(e) {
        console.log("Transactions clicked");
        WrioDocument.performPageTransaction("?transactions");
        e.preventDefault();
    },

    render: function() {
        var readEditMode;
        var transactions;

        var allowTransactions = window.location.host === "webgold." + domain || window.location.host == 'wrioos.local';

/* Uncomment to show transactions
        if (allowTransactions) {
            transactions = (
                <li>
                <a onClick={ this.clickTransactions }>Transactions</a>
                </li>
            );
        }*/

        if (!this.props.editMode) {
            readEditMode = (
                <ul itemProp="breadcrumb" className="breadcrumb">
                    <li className="active">
                        Read
                    </li>
                    <li>
                        <a onClick={ this.props.onEditClick }>Edit</a>
                    </li>
                    {transactions}
                </ul>
            );
        } else {
            readEditMode = (
                <ul itemProp="breadcrumb" className="hidden breadcrumb">
                  <li>
                    <a onClick={ this.props.onReadClick }>Read</a>
                    </li>
                    <li className="active">
                        Edit
                    </li>
                    {transactions}
                </ul>
            );
        }

        if (!this.props.editAllowed) {
            readEditMode = (
                <ul itemProp="breadcrumb" className="hidden breadcrumb">
                    <li className="active">
                        Read
                    </li>
                    {transactions}
                </ul>
            );
        }

        if (this.props.actionButton) {
            readEditMode = (
                <ul itemProp="breadcrumb" className="breadcrumb">
                    <li className="active">
                        {this.props.actionButton}
                    </li>
                </ul>
            );
        }

        return (
            <section>
              <ul className="hide breadcrumb controls tooltip-demo">
                <li title="Read time" data-placement="top" data-toggle="tooltip">
                        <span className="glyphicon glyphicon-time"></span>4-5 minutes
                    </li>
                    <li title="Last modified" data-placement="top" data-toggle="tooltip">
                        <span className="glyphicon glyphicon-calendar"></span>30 May, 2014
                    </li>
                </ul>
                { readEditMode }

            </section>
        );
    }
});
