var React = require('react'),
    Reflux = require('reflux'),
    CreateArticleList = require('./CreateArticleList'),
    store = require('../store/center'),
    UrlMixin = require('../mixins/UrlMixin'),
    CreateTitter = require('titter-wrio-app');

var Center = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    mixins: [Reflux.listenTo(store, 'onStatusChange'), UrlMixin],
    onStatusChange: function (x) {
        this.setState({
            content: x
        });
    },
    getInitialState: function() {
        var locationSearch = this.getUrlParams();
        return {
            content: {
                type: (locationSearch) ? locationSearch : 'article'
            }
        };
    },
    render: function () {
        var content = this.state.content,
            type = content.type;
        if (type === 'cover') {
            return <CreateArticleList data={this.props.data} id={content.url} />;
        } else if (type === 'article') {
            return (
                <div>
                    <CreateArticleList data={this.props.data} id={content.id} />;
                    <CreateTitter scripts={this.props.data} />
                </div>
            );
        } else if (type === 'external') {
            return <CreateArticleList data={this.props.data} id={content.url} />;
        }
    }
});

module.exports = Center;
