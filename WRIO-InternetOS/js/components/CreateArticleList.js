var React = require('react'),
    CreateArticleLists   = require('./CreateArticleLists'),
    CreateArticleElement = require('./CreateArticleElement');
    CreateItemLists      = require('./CreateItemLists');

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
    getItemList: function() {
        return  this.props.data.filter(function (o) {
            return o['@type'] === 'ItemList'
        }).map(function (list) {
            return list.itemListElement.map(function (item, key) {
                return <CreateItemLists data={item} key={key} />
            })
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
                {this.getItemList()}
                {this.getArticles()}
            </article>
        );
    }
});

module.exports = CreateArticleList;
