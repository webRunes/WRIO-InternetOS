var React = require('react');

module.exports = React.createClass({
    propTypes: {
        converter: React.PropTypes.object.isRequired
    },
    render: function () {
        return (
            <section>
                <ul className="breadcrumb controls tooltip-demo">
                    <li title="Read time" data-placement="top" data-toggle="tooltip">
                        <span className="glyphicon glyphicon-time"></span>4-5 minutes
                    </li>
                    <li title="Last modified" data-placement="top" data-toggle="tooltip">
                        <span className="glyphicon glyphicon-calendar"></span>30 May, 2014
                    </li>
                </ul>
                <ul itemprop="breadcrumb" className="breadcrumb">
                    <li className="active">
                        Read
                    </li>
                    <li>
                        <a onClick={ this.props.onEditClick }>Edit</a>
                    </li>
                </ul>
            </section>
        );
    }
});
