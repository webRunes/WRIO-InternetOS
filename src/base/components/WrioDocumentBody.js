/* @flow */
import React from 'react';
import ArticleElement from './ArticleElement';
import ItemListComponent from './ItemList.js';
import UrlMixin from '../mixins/UrlMixin';
import ItemList from '../jsonld/entities/ItemList.js';
import Article from '../jsonld/entities/Article.js';
import LdJsonDocument from '../jsonld/LdJsonDocument';
import LdJsonObject from '../jsonld/entities/LdJsonObject';
import Loading from 'base/components/misc/Loading';

function countArticles(data: Array<LdJsonObject>): { numArticles: number, numLists: number } {
  let numArticles = 0;
  let numLists = 0;
  data.forEach((item) => {
    if (item instanceof Article) {
      numArticles += 1;
    }
    if (item instanceof ItemList) {
      numLists += 1;
    }
  });
  return { numArticles, numLists };
}

/*
*  Base class rendering document body
* */

type PropType = {
  document: LdJsonDocument,
  url: string,
};

class DocumentBody extends React.Component {
  props: PropType;

  // prevent unneeded updates and rerender of the article!
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.url != nextProps.url) return true;
    if (this.props.document.id != nextProps.document.id) return true;

    return false;
  }

  // returns default Article view
  // if document contains article and itemlists, itemlists are not displayed in the default view
  // if no article, then we should display itemLists in the default view

  getArticleContents(document: LdJsonDocument) {
    const data: Array<LdJsonObject> = document.getBlocks();
    const { numArticles, numLists } = countArticles(data);

    if (numArticles === 0 && numLists > 0) {
      return this.getItemLists(data);
    }

    return data
      .filter(element => element instanceof Article)
      .map((element, key) => <ArticleElement data={element} key={key} />);
  }

  getItemLists(data: Array<LdJsonObject>) {
    return data
      .filter(element => element instanceof ItemList)
      .map((list, key) => <ItemListComponent data={list} key={key} />);
  }

  render() {
    const { document, url } = this.props;
    const content = this.getArticleContents(document);

    if (content == null) {
      return <Loading />;
    }
    return <div>{content}</div>;
  }
}

export default DocumentBody;
