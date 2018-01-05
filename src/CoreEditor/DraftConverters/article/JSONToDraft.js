// @flow
import LdJsonDocument from 'base/jsonld/LdJsonDocument';
import { extractMentions } from '../../mentions/mention';
import Immutable from 'immutable';
import { ContentBlock, CharacterMetadata } from 'draft-js';

const keyGen = () => new Date().getTime().toString(32) + Math.random().toString(32);

function createMetadata(name) {
  return Immutable.List(name.split('').map(() => CharacterMetadata.create()));
}

/**
       * Convert JSON representation to draftJS contentState
       * SIDE EFFECTS: modifies this.mentions this.images this.comment
       */

/**
     * Parse individual json part
     * @param subArticle - input json
     * @param processUrl - url flag
     * @returns {Array} of ContentBlocks
     * @private
     */

export default function JSONtoDraft(articleDocument: LdJsonDocument) {
  let order = 0;
  const blockKeyToOrderMap = {};
  let lastKey = 'FIRST';
  const tickets = [];

  function parseArticlePart(subArticle: Object, processUrl: boolean, socials: Array<Object>) {
    const contentBlocks: Array<ContentBlock> = [];
    const { name } = subArticle;

    if (subArticle.name) {
      lastKey = keyGen();
      contentBlocks.push(new ContentBlock([
        ['text', name],
        ['key', lastKey],
        ['characterList', createMetadata(name)],
        ['type', 'header-two'],
      ]));
      blockKeyToOrderMap[lastKey] = order;
      order += 1;
    }

    if (articleDocument.getElementOfType('Article').about !== undefined) {
      order += 1;
    }

    if (subArticle['@type'] === 'SocialMediaPosting') {
      // we are pushwrapping subArticle there, so it later can be created as atomic??? block
      socials.push({ key: lastKey, data: subArticle });
      return { contentBlocks, lastKey, socials };
    }

    if (subArticle['@type'] === 'Article' && subArticle.url) {
      // make sure that nested article has url block
      // we are pushwrapping subArticle there, so it later can be created as atomic??? block
      tickets.push({ key: lastKey, data: subArticle });
      return { contentBlocks, lastKey, socials };
    }

    if (subArticle.articleBody) {
      subArticle.articleBody.forEach((paragraph) => {
        let articleText = paragraph;
        if (processUrl && subArticle.url) {
          articleText += subArticle.url;
        }
        lastKey = keyGen();
        contentBlocks.push(new ContentBlock([
          ['text', articleText],
          ['key', lastKey],
          ['characterList', createMetadata(articleText)],
          ['type', 'unstyled'],
        ]));
        blockKeyToOrderMap[lastKey] = order;
        order += 1;
      });
    }

    return {
      contentBlocks,
      lastKey,
      socials,
      tickets,
    };
  }

  const article = articleDocument.getElementOfType('Article');
  const mentions = article.mentions ? extractMentions(article.mentions) : [];
  const images = article.image ? extractMentions(article.image) : [];
  const socials = [];

  // parse article root
  let { contentBlocks } = parseArticlePart(article, false, socials);
  // and merge it with data from the hasPart section
  contentBlocks = article.hasPart.reduce((r, subarticle) => {
    const res = parseArticlePart(subarticle, true, socials);
    return r.concat(res.contentBlocks);
  }, contentBlocks);

  return {
    contentBlocks,
    images,
    mentions,
    socials,
    tickets,
    blockKeyToOrderMap,
  };
}

// These are not belong anywhre, Think what to do with IT!
// this.socials = socials;
// this.comment = article.comment;
