var React = require('react'),
    CreateList = require('./CreateList'),
    finalListJsonArray = require('../storages/finalListJsonArray');

module.exports = React.createClass({
    propTypes: {
        converter: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        //if (is_list === true) {
        localStorage.setItem('myListItem', JSON.stringify(finalListJsonArray));
    },
    render: function() {
        return (
            <CreateList converter={this.props.converter} data={this.state.data} />
        );
    }
});
