var React = require('react'),
    CreateList = require('./CreateList');

module.exports = React.createClass({
    propTypes: {
        converter: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {data: []};
    },
    render: function() {
        return (
            <CreateList converter={this.props.converter} data={this.state.data} />
        );
    }
});
