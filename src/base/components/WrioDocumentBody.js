/* @flow */
import React from "react";
import ArticleElement from "./ArticleElement";
import CreateItemList from "./ItemList.js";
import UrlMixin from "../mixins/UrlMixin";
import ItemList from "../jsonld/entities/ItemList.js";
import Article from "../jsonld/entities/Article.js";
import LdJsonDocument from "../jsonld/LdJsonDocument";
import LdJsonObject from "../jsonld/entities/LdJsonObject";

/*
*  Base class rendering document body
* */

type PropType = {
  document: LdJsonDocument,
  url: string
};

class DocumentBody extends React.Component {
  props: PropType;

  render() {
    const document = this.props.document;
    var content = this.getContentByName(
      document,
      UrlMixin.searchToObject(this.props.url)
    );

    if (content == null) {
      return <img src="https://default.wrioos.com/img/loading.gif" />;
    } else {
      return <div className="article-margin-bottom">{content}</div>;
    }
  }

  // prevent unneeded updates and rerender of the article!
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.url != nextProps.url) return true;
    if (this.props.document.id != nextProps.document.id) return true;

    return false;
  }

  getContentByName(document: LdJsonDocument, url: string) {
    return this.getArticleContents(document); // show document if no list specified
  }

  // returns default Article view
  // if document contains article and itemlists, itemlists are not displayed in the default view
  // if no article, then we should display itemLists in the default view

  getArticleContents(document: LdJsonDocument) {
    const data = document.getBlocks();
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

    return data.map(function(element, key) {
      if (element instanceof Article) {
        return <ArticleElement data={element} key={key} />;
      }
    });
  }

  getItemLists(data: Array<LdJsonObject>) {
    data = data || [];
    return data
      .filter(o => o instanceof ItemList)
      .map((list, key) => <CreateItemList data={list} key={key} />);
  }
}

export default DocumentBody;
