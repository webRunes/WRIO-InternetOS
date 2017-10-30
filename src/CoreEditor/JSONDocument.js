// @flow
/**
 * Created by michbil on 09.05.16.
 */

import LdJsonDocument from 'base/jsonld/LdJsonDocument';
import { extractMentions } from './mentions/mention';
import Immutable from 'immutable';
import { ContentBlock, CharacterMetadata, Entity } from 'draft-js';

const cleshe = (title, body, description) => (`
  <!DOCTYPE html><html><head><meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <noscript><meta http-equiv="refresh" content="0; URL=https://wrioos.com/no_jscript.html"></noscript>
  <meta name="description" content="${description}"><meta name="author" content="">\n<meta name="keywords" content="">
  <title>${title}</title>
  ${body}
  </head>\n<body>\n
  <script type="text/javascript" src="https://wrioos.com/start.js">\n</script>\n</body></html>\n`);

const keyGen = () =>
  new Date().getTime().toString(32) + Math.random().toString(32);

const getPart = (name: string) => ({
  '@type': 'Article',
  name,
  articleBody: [],
});

const getMention = (name, about, link) => ({
  '@type': 'Article',
  name,
  about,
  url: link,
});
export const getImageObject = (url, name, description) => ({
  '@type': 'ImageObject',
  contentUrl: url,
  description,
  name,
});

const TECHNICAL_BLOCK_ID = '[TECHNICAL_BLOCK_PLEASE_DONT_SHOW_IT]'; // This block is used for debugging purposes

export const getSocialMediaPosting = (src, description, title) => ({
  '@type': 'SocialMediaPosting',
  sharedContent: {
    '@type': 'WebPage',
    headline: title,
    about: description,
    url: src,
  },
});

const getOrderOffset = (article) => {
  let order = 0;
  if (typeof article.name === 'string') {
    order++;
  }
  if (typeof article.about === 'string') {
    order++;
  }
  return order;
};

const hasEntity = (char) => {
  const entityKey = char.getEntity();
  const entity = entityKey ? Entity.get(entityKey) : null;
  return !!entity;
};

const blockHasEntity = (block) => {
  let resolved = false;
  block.findEntityRanges(hasEntity, () => {
    resolved = true;
  });
  return resolved;
};

class GenericLDJsonDocument extends LdJsonDocument {
  constructor(article = []) {
    super(article);
  }

  /**
     * Returns LD+JSON entity of type <type>
     * @param type
     * @returns {*}
     */
  getElementOfType(type) {
    let rv;
    this.data.forEach((element) => {
      if (element['@type'] === type) {
        rv = element;
      }
    });
    return rv;
  }

  /**
     * Make new article skeleton
     * @param lang - article language
     * @param keywords - keywords list
     * @param author - author WRIO id
     * @param widgetData - commentID for the article
     * @param about - description for the article
     * @returns LD+JSON template
     */

  makeArticle(lang, keywords, author, widgetData, about) {
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
  createArticle(author, commentID, about) {
    if (this.getElementOfType('Article')) {
      console.log('Failed to create article, it already exists');
    } else {
      this.data.push(this.makeArticle('En', '', author, commentID, about));
    }
  }

  /**
   * Create temporary in memory document from cover
   * @param {*} cover 
   */
  static createFromCover(cover) {
    const el = cover.itemListElement[0];
    return {
      '@type': 'Article',
      name: el.name,
      articleBody: el.text,
      hasPart: [],
      mentions: [],
    };    
  }

  static newCover() {
    return {
      '@type': 'Article',
      name: "Cover title",
      articleBody: ["Cover text"],
      hasPart: [],
      mentions: [],
    };
  }

  getCommentID() {
    return this.getElementOfType('Article').comment;
  }
  setCommentID(cid) {
    this.getElementOfType('Article').comment = cid;
  }
}

export default class EditableJSONDocument extends GenericLDJsonDocument {
  constructor(article) {
    super(article);
    this.comment = '';
    this.order = 0;
  }

  _createMetadata(name) {
    return Immutable.List(name.split('').map(e => CharacterMetadata.create()));
  }

  /**
     * Parse individual json part
     * @param subArticle - input json
     * @param processUrl - url flag
     * @returns {Array} of ContentBlocks
     * @private
     */

  _parseArticlePart(
    subArticle: Object,
    processUrl: boolean,
    _lastKey: string,
    socials: Array<Object>,
    blockKeyToOrderMap: Object,
  ) {
    const contentBlocks: Array<Object> = [];
    const { name } = subArticle;
    let lastKey = _lastKey;

    if (subArticle.name) {
      lastKey = keyGen();
      contentBlocks.push(new ContentBlock([
        ['text', name],
        ['key', lastKey],
        ['characterList', this._createMetadata(name)],
        ['type', 'header-two'],
      ]));
      blockKeyToOrderMap[lastKey] = this.order;
      this.order++;
    }

    if (this.getElementOfType('Article').about !== undefined) {
      this.order++;
    }

    if (subArticle['@type'] == 'SocialMediaPosting') {
      // we are pushwrapping subArticle there, so it later can be created as atomic??? block
      socials.push({ key: lastKey, data: subArticle });
      return { contentBlocks, lastKey, socials };
    }

    if (subArticle.articleBody) {
      subArticle.articleBody.forEach((paragraph, i) => {
        let articleText = paragraph;
        if (processUrl && subArticle.url) {
          articleText += subArticle.url;
        }
        lastKey = keyGen();
        contentBlocks.push(new ContentBlock([
          ['text', articleText],
          ['key', lastKey],
          ['characterList', this._createMetadata(articleText)],
          ['type', 'unstyled'],
        ]));
        blockKeyToOrderMap[lastKey] = this.order;
        this.order++;
      });
    }

    return { contentBlocks, lastKey, socials };
  }

  /**
     * Convert JSON representation to draftJS contentState
     * SIDE EFFECTS: modifies this.mentions this.images this.comment
     */

  toDraft(): Array<ContentBlock> {
    this.order = 0;
    const article = this.getElementOfType('Article');
    const mentions = article.mentions ? extractMentions(article.mentions) : [];
    const images = article.image ? extractMentions(article.image) : [];
    this.comment = article.comment;
    let lastKey = 'FIRST';
    const socials = [];
    const blockKeyToOrderMap = {};
    // parse article root
    const res = this._parseArticlePart(
      article,
      false,
      lastKey,
      socials,
      blockKeyToOrderMap,
    );
    let { contentBlocks, lastBlock } = res;
    lastKey = res.lastKey;
    // and merge it with data from the hasPart section
    contentBlocks = article.hasPart.reduce((r, subarticle) => {
      const res = this._parseArticlePart(
        subarticle,
        true,
        lastKey,
        socials,
        blockKeyToOrderMap,
      );
      lastKey = res.lastKey;
      r = r.concat(res.contentBlocks);
      return r;
    }, contentBlocks);
    this.socials = socials;
    return {
      contentBlocks, images, mentions, socials, blockKeyToOrderMap,
    };
  }

  /**
     * Get first block(title) of the page
     * @param contentState
     * @returns {string} Title of the page
     */

  static getTitle(contentState) {
    const blockMap = contentState.getBlockMap(),
      firstBlock = blockMap.first();
    return firstBlock.getText();
  }

  /**
     * Cleanups resulting contentBlocks from empty blocks
     * group technical data into attached array, later entities will be extracted from
     * @param blocks
     * @returns {*}
     * @private
     */

  _filterBlockMap(blocks) {
    const current = null;
    const reduced = blocks.reduce((acc, current) => {
      const blockType = current.getType();
      const blockText = current.getText();
      const haveEntity = blockHasEntity(current);

      if (blockType == 'atomic' && blockText == TECHNICAL_BLOCK_ID) {
        console.log('Deleting technical block');
        acc[acc.length - 1].attached.push(current);
        return acc;
      }
      const newAcc = [...acc, { el: current, attached: [] }];
      return newAcc;
    }, []);
    return reduced;
  }

  /**
     * Makees initial article JSON from conentBlocks
     * @param initialValue - initial value, took from the original editing document
     * @param blockMap - blockmap array
     * @private
     */

  _mkArticleJson(initialValue, blockMap) {
    const firstBlock = 0;
    const lastBlock = blockMap.length - 1;
    const article = initialValue;
    article.articleBody = [];
    article.hasPart = [];
    article.image = [];
    article.mentions = [];
    article.name = blockMap[0].el.getText();

    let isPart = false,
      part; // TODO: figure out what part was meant for

    blockMap.forEach((element, i) => {
      const e = element.el;
      const blockType = e.getType();
      const blockText = e.getText();
      const ordinaryParagraph = blockType !== 'header-two';

      console.log('Dump BLOCK: ', i, blockType, blockText);

      if (i == 0) {
        // skip header block
        return;
      }
      if (isPart) {
        if (ordinaryParagraph) {
          part.articleBody.push(blockText);
          if (i === lastBlock) {
            article.hasPart.push(part);
          }
        } else {
          article.hasPart.push(part);
          part = getPart(blockText);
        }
      } else if (ordinaryParagraph) {
        article.articleBody.push(blockText);
      } else {
        isPart = true;
        part = getPart(blockText);
      }
    });
    return article;
  }

  /**
     * Converts current draftJS content state to LD+JSON representation
     * @param contentState
     */

  draftToJson(contentState) {
    const formatMention = (url, text, blockIndex, offset) =>
      `${url}?'${text}':${blockIndex},${offset}`;
    const blockMap = contentState.getBlockMap();
    const filteredBlockMap = this._filterBlockMap(blockMap);
    const article = this._mkArticleJson(
      this.getElementOfType('Article'),
      filteredBlockMap,
    ); // first pass

    const order = getOrderOffset(article);

    filteredBlockMap.forEach((element, i) => {
      // second pass to create links images and socials
      let entity;
      const findEntityOfType = type => (char) => {
        const entityKey = char.getEntity();
        entity = entityKey ? Entity.get(entityKey) : null;
        return !!entity && entity.getType() === type;
      };
      const mkLink = block => (anchorOffset, focusOffset) => {
        const data = entity.getData();
        const url = data.linkUrl;
        const name = data.linkTitle || '';
        const linkText = block.getText().substring(anchorOffset, focusOffset);
        article.mentions.push(getMention(
          name,
          '',
          formatMention(url, linkText, order + i, anchorOffset),
        ));
      };
      const mkImage = block => (anchorOffset, focusOffset) => {
        const data = entity.getData();
        const url = data.src;
        const name = data.title || '';
        const desc = data.description || '';
        article.image.push(getImageObject(`${url}?${order + i},${anchorOffset}`, name, desc));
      };

      const mkSocial = block => (anchorOffset) => {
        const data = entity.getData();
        const url = data.src;
        const desc = data.description || '';
        const title = data.title || '';
        article.hasPart.push(getSocialMediaPosting(url, desc, title));
      };

      element.el.findEntityRanges(findEntityOfType('LINK'), mkLink(element.el));
      element.el.findEntityRanges(
        findEntityOfType('IMAGE'),
        mkImage(element.el),
      );
      element.attached.forEach(e =>
        e.findEntityRanges(findEntityOfType('IMAGE'), mkImage(e)));

      element.el.findEntityRanges(
        findEntityOfType('SOCIAL'),
        mkSocial(element.el),
      );
      element.attached.forEach(e =>
        e.findEntityRanges(findEntityOfType('SOCIAL'), mkSocial(e)));
    });
    return article;
  }

  /**
     * Converts draftJS editor contents to
     * @param contentState - draftJS content state
     * @param author - author of the page
     * @param commentID - comment id
     * @returns {Promise} to the struct with html and json representation of the article
     */

  draftToHtml(contentState, author, commentID) {
    this.draftToJson(contentState || {});
    const article = this.getElementOfType('Article');
    article.comment = commentID;
    article.author = author;
    return {
      html: this.toHtml(),
      json: this.data,
    };
  }

  /**
     * Exports document to html text
     * @returns {string} text of the html document
     */

  toHtml() {
    const scrStart = '<script type="application/ld+json">';
    const scrEnd = '</script>';
    let scripts = '';
    this.data.forEach((item) => {
      scripts += `${scrStart + JSON.stringify(item, null, ' ') + scrEnd}\n`;
    });
    return cleshe(
      this.getElementOfType('Article').name,
      scripts,
      this.getElementOfType('Article').about,
    );
  }

  /**
     * sets current document description(about)
     * @param text - description text
     */

  setAbout(text) {
    const article = this.getElementOfType('Article');
    article.about = text;
  }
}
