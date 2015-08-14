var React = require('react');

module.exports = React.createClass({
    propTypes: {
        converter: React.PropTypes.object.isRequired,
        data: React.PropTypes.array.isRequired
    },
    render: function() {
        var rawMarkup = this.props.converter.makeHtml(this.props.data.toString());
        if (rawMarkup === '') {
            return null;
        }
        return (
            <section dangerouslySetInnerHTML={{__html: rawMarkup}} />
        );
    }
});
