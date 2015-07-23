var React = require('react'),
    Reflux = require('reflux'),
    CreateArticleList = require('./CreateArticleList'),
    store = require('../store/center'),
    CreateTitter = require('titter-wrio-app');

var Center = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    mixins: [Reflux.listenTo(store, 'onStatusChange')],
    onStatusChange: function (x) {
        this.setState({
            content: x
        });
    },
    getInitialState: function() {
        return {
            content: {
                type: 'article'
            }
        };
    },
    render: function () {
        var content = this.state.content,
            type = content.type;
        if (type === 'cover') {
            return <h1>COVER WILL BE HERE</h1>;//TODO
        } else if (type === 'article') {
            return (
                <div>
                    <CreateArticleList data={this.props.data} id={content.id} />;
                    <CreateTitter scripts={this.props.data} />
                </div>
            );
        } else if (type === 'external') {
            return <CreateArticleList data={content.data} id={content.url} />;
        }
    }
});

module.exports = Center;
