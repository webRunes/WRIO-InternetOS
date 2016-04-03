import React from 'react';
import CreateArticleLists from './CreateArticleLists';
import CreateArticleElement from './CreateArticleElement';
import CreateItemLists from './CreateItemLists';
import CreateCover from './CreateCover';
import {Carousel} from 'react-bootstrap';
import {CarouselItem} from 'react-bootstrap';
import _ from 'lodash';
import UrlMixin from '../mixins/UrlMixin';
import WrioDocument from '../store/WrioDocument.js';

var CreateArticleList = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        id: React.PropTypes.string
    },
    getArticles: function() {
        var mentions = _.chain(this.props.data)
            .pluck('itemListElement').flatten()
            .pluck('mentions').flatten()
            .filter(function(item) {
                return !_.isEmpty(item);
            })
            .map(function(item, index) {
                return <CreateArticleLists data={item} key={index} />;
            })
            .value();

        var isMentions = mentions.length > 0;

        if (isMentions) {
            return this.getItemList();
        }

        if (!this.props.data) {
            console.log('Assertion raised, CreateArticleList this.props.data not specified!', this.props);
            return (<p>Error, cannot render article list</p>);
        }

        return this.props.data
            .map(function(o, key) {
                if (o.url) {
                    return <CreateArticleLists data={o} key={key} />;
                } else if (o['@type'] !== 'Article') {
                    return o.itemListElement.map(function(item, index) {
                        return <CreateArticleLists data={item} key={index} />;
                    });
                } else {
                    return <CreateArticleElement data={o} key={key} />;
                }
            });
    },
    mixins: [UrlMixin],
    getItemList: function() {
        return this.props.data.filter(function(o) {
                return o['@type'] === 'ItemList';
            })
            .map(function(list) {
                return list.itemListElement.map(function(item, key) {
                    return <CreateItemLists data={item} key={key} />;
                });
            });
    },
    getCoverList: function() {
        var data = _.chain(this.props.data)
            .pluck('itemListElement')
            .flatten()
            .filter(function(item) {
                return !_.isEmpty(item);
            })
            .map(function(item, key) {
                return (<CarouselItem key={key}><CreateCover data={item} key={key} isActive={key === 0} /></CarouselItem>);
            })
            .value();

        return (
            <Carousel>{data}</Carousel>
        );
    },
    componentDidUpdate: function() {
        var id = this.props.id;
        if (id) {
            location.hash = '#' + id;
        }
    },
    getContentByName: function(params) {

        if (params.cover) {
            return this.getCoverList();
        }

        if (typeof params.list === 'undefined') {
            return this.getArticles();
        } else {
            var name = params.list.toLowerCase();
            if (name === 'cover') {
                return this.getCoverList();
            } else {
                return this.getItemList();
            }
        }

    },
    render: function() {
        return (
            <article>
                {this.getContentByName(this.searchToObject(WrioDocument.getUrl()))}
            </article>
        );
    }
});

export default CreateArticleList;
