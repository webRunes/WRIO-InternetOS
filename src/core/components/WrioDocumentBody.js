import React from 'react';
import WrioDocument from '../store/WrioDocument.js';
import WrioDocumentActions from '../actions/WrioDocument.js';
import ArticleElement from './ArticleElement';
import CreateItemList from './ItemList.js';
import UrlMixin from '../mixins/UrlMixin';
import ItemList from '../jsonld/entities/ItemList.js';
import Article from '../jsonld/entities/Article.js';

/*
*  Base class rendering document body
* */

class DocumentBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
        this.oldError = "dummy";
    }

    shouldComponentUpdate() {
        let updIndex = WrioDocument.getUpdateIndex();
        let changed =  updIndex !== this.index;
        let errorChanged = this.state.error != this.oldError;
        // TODO add check for error message
        return changed || errorChanged;
    }

    componentDidMount() {
        this.wrioStore = WrioDocument.listen(this.onDocumentChange.bind(this));
        this.index = 0;
    }

    componentWillUnmount() {
        this.wrioStore();
    }

    onDocumentChange(doc) {
        if (doc.error) {
            this.setState({error: true});
        } else {
            if (this.state.error) {
                this.setState({error: false});
            }
        }
    }

    render() {

        this.index = WrioDocument.getUpdateIndex(); this.oldError = this.state.error;
        var loading = WrioDocument.getLoading();

        if (this.state.error || (loading && loading.error)) {
                return (<div>Error loading page, try again later</div>);
        }

        if (loading === true) {
            return (<img src="https://default.wrioos.com/img/loading.gif"/>);
        }

        console.log("Document redraw");

        var content = this.getContentByName(UrlMixin.searchToObject(WrioDocument.getUrl()));

        if (content == null) {
            return (<img src="https://default.wrioos.com/img/loading.gif"/>);
        } else {
            return (
              <div className="article-margin-bottom">
                {content}
              </div>
            );
        }
    }

    componentDidUpdate () {
        WrioDocumentActions.postUpdateHook();
    }

    getItemLists(data) {
        data = data || [];
        return data.filter((o) => o instanceof ItemList)
            .map( (list,key) => <CreateItemList data={list} key={key} />);
        }

    getContentByName(url) {
        let listName = url.list;
        if (url.cover) {
            listName = 'cover';
        }

        if (typeof listName === 'undefined') {
            return this.getArticleContents(WrioDocument.getDocument()); // show document if no list specified
        } else {
           listName = listName.toLowerCase();
            let item = WrioDocument.getListItem(listName);
            if (item) {
                let {data, type} = item;
                if (type === 'cover') {
                    return this.getCoverList(data);
                } else {
                    return this.getItemLists(data);
                }
            }
        }
    }

    // returns default Article view
    // if document contains article and itemlists, itemlists are not displayed in the default view
    // if no article, then we should display itemLists in the default view

    getArticleContents(data) {
        let numArticles = 0;
        let numLists = 0;
        for (let item of data) {
            if (item instanceof Article) {
                numArticles++;
            }
            if (item instanceof ItemList) {
                numLists++;
            }
        }

        if (numArticles == 0 && numLists > 0) {
            return this.getItemLists(data);
        }

        return data
            .map(function (element, key) {
                if (element instanceof Article) {
                    return <ArticleElement data={element} key={key}/>;
                }
            });
    }


}

DocumentBody.propTypes = {};

export default DocumentBody;
