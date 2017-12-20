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

const stripKey = (el) => {
  const newEl = { ...el, '@type': 'Article' };
  delete newEl.key;
  return newEl;
};

export default class ListExporter {
  doc: LdJsonDocument;
  constructor(doc: LdJsonDocument) {
    this.doc = new LdJsonDocument([
      {
        '@context': 'http://schema.org',
        '@type': 'ItemList',
        name: 'Collection',
        description: '',
        itemListElement: [],
      },
    ]);
  }

  listToHtml(elements: Array<Object>) {
    const itemList = this.doc.getElementOfType('ItemList');
    const newCover = {
      ...itemList,
      itemListElement: elements.map(stripKey),
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
