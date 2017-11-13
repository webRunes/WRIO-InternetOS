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
       * Convert Cover JSON representation to draftJS contentState
       * SIDE EFFECTS: modifies this.mentions this.images this.comment
       */

/**
     * Parse individual json part
     * @param subArticle - input json
     * @param processUrl - url flag
     * @returns {Array} of ContentBlocks
     * @private
     */

export default function JSONtoDraft(coverDocument: LdJsonDocument) {
  let order = 0;
  const blockKeyToOrderMap = {};
  let lastKey = 'FIRST';

  function parseCoverPart(element: Object, processUrl: boolean) {
    const contentBlocks: Array<ContentBlock> = [];
    const { name } = element;

    if (element.name) {
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

    if (element.text) {
      element.text.forEach((paragraph) => {
        let coverText = paragraph;
        if (processUrl && element.url) {
          coverText += element.url;
        }
        lastKey = keyGen();
        contentBlocks.push(new ContentBlock([
          ['text', coverText],
          ['key', lastKey],
          ['characterList', createMetadata(coverText)],
          ['type', 'unstyled'],
        ]));
        blockKeyToOrderMap[lastKey] = order;
        order += 1;
      });
    }

    return { contentBlocks };
  }

  const cover = coverDocument.getElementOfType('ImageObject');
  const mentions = cover.mentions ? extractMentions(cover.mentions) : [];

  // parse article root
  const { contentBlocks } = parseCoverPart(cover, false);

  return {
    contentBlocks,
    mentions,
    images: [],
    socials: [],
    blockKeyToOrderMap,
  };
}

// These are not belong anywhre, Think what to do with IT!
// this.socials = socials;
// this.comment = article.comment;
