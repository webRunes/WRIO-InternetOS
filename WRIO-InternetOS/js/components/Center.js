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
            type = this.searchToObject().list;
        if (type === 'Cover') {
            return <CreateArticleList data={this.props.data} id={content.url} />;
        } else if (type === 'Blog') {
            return <CreateArticleList data={this.props.data} id={content.url} />;
        }
        else {
            return (
                <div>
                    <CreateArticleList data={this.props.data} id={content.id} />;
                    <CreateTitter scripts={this.props.data} />
                </div>
            );
        }
    }
});

module.exports = Center;
