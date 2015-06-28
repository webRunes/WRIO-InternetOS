var React = require('react'),
    CreateArticleLists = require('./CreateArticleLists'),
    CreateArticleElement = require('./CreateArticleElement');

var CreateArticleList = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        id: React.PropTypes.string
    },
    getArticles: function () {
        return this.props.data
            .filter(function (o) {
                return o['@type'] === 'Article';
            })
            .map(function (o, key) {
                if (o.url) {
                    return <CreateArticleLists data={o} key={key} />;
                } else {
                    return <CreateArticleElement data={o} key={key} />;
                }
            });
    },
    componentDidUpdate: function () {
        var id = this.props.id;
        if (id) {
            location.hash = '#' + id;
        }
    },
    render: function () {
        return (
            <article>
                {this.getArticles()}
            </article>
        );
    }
});

module.exports = CreateArticleList;
