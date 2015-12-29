var domain = '';
if (process.env.DOMAIN === undefined) {
    domain = 'wrioos.com';
} else {
    domain = process.env.DOMAIN;
}

var React = require('react');

module.exports = React.createClass({
    propTypes: {
        editMode: React.PropTypes.bool.isRequired,
        transactionsMode: React.PropTypes.bool.isRequired,
        onEditClick: React.PropTypes.func.isRequired,
        onReadClick: React.PropTypes.func.isRequired,
        onTransactionsClick: React.PropTypes.func.isRequired,
        editAllowed: React.PropTypes.bool.isRequired
    },
    render: function () {
        var readEditMode;



        if (!this.props.editMode) {
            readEditMode = (
                <ul itemProp="breadcrumb" className="breadcrumb">
                    <li className="active">
                        Read
                    </li>
                    <li>
                        <a onClick={ this.props.onEditClick }>Edit</a>
                    </li>
                    if (window.location.host === "webgold." + domain) {
                        <li>
                            <a onClick={ this.props.onTransactionsClick }>Transactions</a>
                        </li>
                    }
                </ul>);
        } else {
            readEditMode = (
                <ul itemProp="breadcrumb" className="breadcrumb">
                    <li>
                        <a onClick={ this.props.onReadClick }>Read</a>
                    </li>
                    <li className="active">
                        Edit
                    </li>
                    if (window.location.host === "webgold." + domain) {
                        <li>
                            <a onClick={ this.props.onTransactionsClick }>Transactions</a>
                        </li>
                    }
                </ul>);
        }

        if (!this.props.editAllowed) {
            readEditMode = (
                <ul itemProp="breadcrumb" className="breadcrumb">
                    <li className="active">
                        Read
                    </li>
                    if (window.location.host === "webgold." + domain) {
                        <li>
                            <a onClick={ this.props.onTransactionsClick }>Transactions</a>
                        </li>
                    }
                </ul>);
        }

        if (this.props.actionButton) {
            readEditMode = (
                <ul itemProp="breadcrumb" className="breadcrumb">
                    <li className="active">
                        {this.props.actionButton}
                    </li>
                </ul>);
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
