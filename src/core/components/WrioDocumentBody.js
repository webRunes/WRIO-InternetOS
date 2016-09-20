import React from 'react';
import WrioDocument from '../store/WrioDocument.js';
import CreateArticleLists from './CreateArticleLists';
import CreateArticleElement from './CreateArticleElement';
import CreateItemLists from './CreateItemLists';
import CreateCover from './CreateCover';
import {Carousel} from 'react-bootstrap';
import {CarouselItem} from 'react-bootstrap';
import _ from 'lodash';
import UrlMixin from '../mixins/UrlMixin';
import ItemList from '../jsonld/entities/ItemList.js';
import Article from '../jsonld/entities/Article.js';

/*
*  Base class rendering document body
* */

class DocumentBody extends React.Component {

    shouldComponentUpdate() {
        let updIndex = WrioDocument.getUpdateIndex();
        let changed =  updIndex !== this.index;
        return changed;
    }

    componentDidMount() {
        this.wrioStore = WrioDocument.listen(this.onDocumentChange.bind(this));
        this.index = 0;
    }

    componentWillUnmount() {
        this.wrioStore();
    }

    onDocumentChange(doc) {
        // this.setState(doc);
    }

    render() {

        this.index = WrioDocument.getUpdateIndex();
        var loading = WrioDocument.getLoading();

        if (loading !== undefined) {
            if (loading.error) {
                return (<div>Error loading page, try again later</div>);
            }
        }

        if (loading === true) {
            return (<img src="https://wrioos.com/Default-WRIO-Theme/img/loading.gif"/>);
        }

        var content = this.getContentByName(UrlMixin.searchToObject(WrioDocument.getUrl()));

        if (content == null) {
            return (<img src="https://wrioos.com/Default-WRIO-Theme/img/loading.gif"/>);
        } else {
            return (
                <article>
                    {content}
                </article>
            );
        }
    }

    getContentByName(url) {
        if (url.cover) {
            var data = WrioDocument.getListItem('cover');
            if (!data) {
                return null;
            }
            return this.getCoverList();
        }

        if (typeof url.list === 'undefined') {
            return this.getArticleContents(WrioDocument.getDocument());
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
    }


    getArticleContents(data) {

        var mentions = _.chain(data)
            .pluck('itemListElement').flatten()
            .pluck('mentions').flatten()
            .filter(function (item) {
                return !_.isEmpty(item);
            })
            .map(function (item, index) {
                return <CreateArticleLists data={item} key={index}/>;
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
            .map(function (element, key) {
                if (element instanceof ItemList) {
                    if (element.data.url) {
                        return <CreateArticleLists data={element} key={key}/>;
                    } else {
                        return element.children.map((item, index) => <CreateArticleLists data={item} key={index}/>);
                    }

                } else if (element instanceof Article) {
                    return <CreateArticleElement data={element} key={key}/>;
                }
            });
    }
/*

 */

    getItemList(data) {
        data = data || [];
        return data.filter((o) => o instanceof ItemList)
            .map(function (list) {
                return list.children.map(function (item, key) {
                    return <CreateItemLists data={item} key={key}/>;
                });
            });
    }


    getCoverList(data) {
        var data = _.chain(data)
            .pluck('itemListElement')
            .flatten()
            .filter(function (item) {
                return !_.isEmpty(item);
            })
            .map(function (item, key) {
                return (
                    <CarouselItem key={key}><CreateCover data={item} key={key} isActive={key === 0}/></CarouselItem>);
            })
            .value();

        return (
            <Carousel>{data}</Carousel>
        );
    }



}

DocumentBody.propTypes = {};

export default DocumentBody;
