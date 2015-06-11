var React = require('react');

module.exports = React.createClass({
    render: function () {
        var readEditMode;
        if (!this.props.editMode) {
            readEditMode = (
                <ul itemprop="breadcrumb" className="breadcrumb">
                    <li className="active">
                        Read
                    </li>
                    <li>
                        <a onClick={ this.props.onEditClick }>Edit</a>
                    </li>
                </ul>);
        } else {
            readEditMode = (
                <ul itemprop="breadcrumb" className="breadcrumb">
                    <li>
                        <a onClick={ this.props.onReadClick }>Read</a>
                    </li>
                    <li className="active">
                        Edit
                    </li>
                </ul>);
        }
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
                { readEditMode }
            </section>
        );
    }
});
