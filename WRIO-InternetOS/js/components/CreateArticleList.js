var React = require('react'),
    CreateArticleLists = require('./CreateArticleLists'),
    CreateArticleElement = require('./CreateArticleElement'),
    CreateItemLists = require('./CreateItemLists'),
    CreateCover = require('./CreateCover'),
    Carousel = require('react-bootstrap').Carousel,
    CarouselItem = require('react-bootstrap').CarouselItem,
    UrlMixin = require('../mixins/UrlMixin');

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
    mixins: [UrlMixin],
    getItemList: function() {
        return this.props.data.filter(function (o) {
            return o['@type'] === 'ItemList';
        }).map(function (list) {
            return list.itemListElement.map(function (item, key) {
                return <CreateItemLists data={item} key={key} />;
            });
        });
    },
    getCoverList: function() {
        var data = this.props.data.filter(function (o) {
            return o['@type'] === 'ItemList';
        }).map(function (list) {
            return list.itemListElement.map(function (item, key) {
                return <CarouselItem><CreateCover data={item} key={key} isActive={key === 0} /></CarouselItem>;
            });
        });
        return (
            <Carousel>{data}</Carousel>
        );
    },
    componentDidUpdate: function () {
        var id = this.props.id;
        if (id) {
            location.hash = '#' + id;
        }
    },
    getContentByType: function(type) {
        return {
            'cover': this.getCoverList(),
            'external': this.getItemList(),
            'article': this.getArticles()
        }[type] || this.getArticles();
    },
    render: function () {
        return (
            <article>
                {this.getContentByType(this.getUrlParams())}
            </article>
        );
    }
});

module.exports = CreateArticleList;
