// @flow
import LdJsonDocument from 'base/jsonld/LdJsonDocument';
import { extractMentions } from './mentions/mention';
import Immutable from 'immutable';
import { ContentBlock, CharacterMetadata, Entity } from 'draft-js';

import ArticleDraftToJSON from './DraftConverters/article/DraftToJSON';
import CoverDraftToJSON from './DraftConverters/cover/DraftToJSON';

const cleshe = (title, body, description) => `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<noscript><meta http-equiv="refresh" content="0; URL=https://wrioos.com/no_jscript.html"></noscript>
<meta name="description" content="${description}"><meta name="author" content="">\n<meta name="keywords" content="">
<title>${title}</title>
${body}
</head>\n<body>\n
<script type="text/javascript" src="https://wrioos.com/start.js">\n</script>\n</body></html>\n`;

/**
     * Make new article skeleton
     * @param lang - article language
     * @param keywords - keywords list
     * @param author - author WRIO id
     * @param widgetData - commentID for the article
     * @param about - description for the article
     * @returns LD+JSON template
     */

export function makeArticle(
  lang: string,
  keywords: string,
  author: string,
  widgetData: string,
  about: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    inLanguage: lang,
    keywords,
    author: `https://wr.io/${author}/?wr.io=${author}`,
    editor: '',
    name: 'Untitled',
    about,
    articleBody: [' '],
    hasPart: [],
    mentions: [],
    comment: widgetData,
  };
}

/**
 * Wrapper for makeArticle
 * @param author
 * @param commentID
 * @param about
 */
export function createArticleTemplate(author: string, commentID: string, about: string) {
  return makeArticle('En', '', author, commentID, about);
}

/**
     * Get first block(title) of the page
     * @param contentState
     * @returns {string} Title of the page
     */

export function getTitle(contentState: ContentState) {
  const blockMap = contentState.getBlockMap();
  const firstBlock = blockMap.first();
  return firstBlock.getText();
}

export default class DraftExporter {
  doc: LdJsonDocument;
  constructor(doc: LdJsonDocument) {
    this.doc = doc;
  }

  /**
     * Converts draftJS editor contents to
     * @param contentState - draftJS content state
     * @param author - author of the page
     * @param commentID - comment id
     * @returns {Promise} to the struct with html and json representation of the article
     */

  articleDraftToHtml(
    contentState: ContentState,
    author: string,
    commentID: string,
    coverPath: string,
  ): LdJsonDocument {
    const article = ArticleDraftToJSON(contentState, this.doc);
    article.comment = commentID;
    article.author = author;
    this.doc.setElementOfType('Article', article);

    if (coverPath) {
      this.doc.setElementOfType('ItemList', {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'webRunes cover list',
        itemListElement: [
          {
            '@type': 'ItemList',
            name: 'Cover',
            description: 'Cover',
            image: 'https://default.wrioos.com/img/no-photo-200x200.png',
            url: coverPath,
          },
        ],
      });
    }

    return this.toHtml(
      this.doc.getElementOfType('Article').name,
      this.doc.getElementOfType('Article').about,
    );
  }

  coverDraftToHtml(tabs: Array<{ contentState: ContentState, image: string }>) {
    const elements = tabs.map((el) => {
      const { contentState, image } = el;
      const coverElement = CoverDraftToJSON(contentState, this.doc);
      return { ...coverElement, contentUrl: image };
    });
    const itemList = this.doc.getElementOfType('ItemList');
    const newCover = {
      ...itemList,
      itemListElement: elements,
    };
    this.doc.setElementOfType('ItemList', newCover);
    return this.toHtml('', '');
  }

  /**
     * Exports document to html text
     * @returns {string} text of the html document
     */

  toHtml(name: string, about: string) {
    const scrStart = '<script type="application/ld+json">';
    const scrEnd = '</script>';
    let scripts = '';
    this.doc.data.forEach((item) => {
      scripts += `${scrStart + JSON.stringify(item, null, ' ') + scrEnd}\n`;
    });
    return cleshe(name, scripts, about);
  }
}
