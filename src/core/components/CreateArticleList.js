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
    },
    getArticles: function(data) {
        var mentions = _.chain(data)
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
            return this.getItemList(data);
        }

        if (!data) {
            console.log('Assertion raised, CreateArticleList data not specified!', this.props);
            return (<p>Error, cannot render article list</p>);
        }

        return data
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
    getItemList: function(data) {
        data = data || [];
        return data.filter(function(o) {
                return o['@type'] === 'ItemList';
            })
            .map(function(list) {
                return list.itemListElement.map(function(item, key) {
                    return <CreateItemLists data={item} key={key} />;
                });
            });
    },
    getCoverList: function(data) {
        var data = _.chain(data)
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
/*        var id = this.props.id;
        if (id) {
            location.hash = '#' + id;
        }*/
    },


    getContentByName: function(url) {


        if (url.cover) {
            var data = WrioDocument.getListItem('cover');
            if (!data) {
                return null;
            }
            return this.getCoverList();
        }

        if (typeof url.list === 'undefined') {
            return this.getArticles(WrioDocument.getDocument());
        } else {
            var name = url.list.toLowerCase();
            var data = WrioDocument.getListItem(name);
            if (!data) {
                return null;
            }
            if (name === 'cover') {
                return this.getCoverList(data);
            } else {
                return this.getItemList(data);
            }
        }

    },
    render: function() {
        var content = this.getContentByName(this.searchToObject(WrioDocument.getUrl()));

        if (content == null) {
            return (<img src="https://wrioos.com/Default-WRIO-Theme/img/loading.gif" />);
        } else {
            return (
                <article>
                    {content}
                </article>
            );
        }

    }
});

export default CreateArticleList;
