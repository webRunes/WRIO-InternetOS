// @flow
import LdJsonDocument from 'base/jsonld/LdJsonDocument';
import Immutable from 'immutable';
import { ContentBlock, CharacterMetadata, Entity, ContentState } from 'draft-js';
import { getPart, getImageObject, getSocialMediaPosting, getMention } from '../../utils/helpers';

const TECHNICAL_BLOCK_ID = '[TECHNICAL_BLOCK_PLEASE_DONT_SHOW_IT]'; // This block is used for debugging purposes

/**
     * Cleanups resulting contentBlocks from empty blocks
     * group technical data into attached array, later entities will be extracted from
     * @param blocks
     * @returns {*}
     * @private
     */

const filterBlockMap = function filterBlockMap(blocks) {
  const reduced = blocks.reduce((acc, current) => {
    const blockType = current.getType();
    const blockText = current.getText();

    if (blockType === 'atomic' && blockText === TECHNICAL_BLOCK_ID) {
      console.log('Deleting technical block');
      acc[acc.length - 1].attached.push(current);
      return acc;
    }
    const newAcc = [...acc, { el: current, attached: [] }];
    return newAcc;
  }, []);
  return reduced;
};

/**
     * Makees initial article JSON from conentBlocks
     * @param initialValue - initial value, took from the original editing document
     * @param blockMap - blockmap array
     * @private
     */

const mkCoverJson = function mkCoverJson(initialValue: Object, blockMap): Object {
  const cover = {
    ...initialValue,
    '@type': 'ImageObject',
    text: [],
    mentions: [],
    name: blockMap[0].el.getText(),
  };

  blockMap.forEach((element, i) => {
    const e = element.el;
    const blockType = e.getType();
    const blockText = e.getText();
    console.log('Dump BLOCK: ', i, blockType, blockText);
    if (i === 0) {
      // skip header block
    } else {
      cover.text.push(blockText);
    }
  });
  return cover;
};

const getOrderOffset = function getOrderOffset(article) {
  let order = 0;
  if (typeof article.name === 'string') {
    order += 1;
  }
  if (typeof article.about === 'string') {
    order += 1;
  }
  return order;
};

const formatMention = (url, text, blockIndex, offset) => `${url}?'${text}':${blockIndex},${offset}`;

/**
 * This function merges contentBlocks into existing article
 * @param {*} contentBlocks - draft ContentBlock
 * @param {*} article - Article to merge data
 */
export default function DraftToJSON(contentState: ContentState, srcCover: LdJsonDocument) {
  const blockMap = contentState.getBlockMap();
  const filteredBlockMap = filterBlockMap(blockMap);
  const cover = mkCoverJson(srcCover.getElementOfType('ImageObject'), filteredBlockMap); // first pass
  const order = getOrderOffset(cover);

  // second pass to create links images and socials
  filteredBlockMap.forEach((element, i) => {
    let entity;
    const findEntityOfType = type => (char) => {
      const entityKey = char.getEntity();
      entity = entityKey ? Entity.get(entityKey) : null;
      return !!entity && entity.getType() === type;
    };
    const mkLink = block => (anchorOffset, focusOffset) => {
      const data = entity.getData();
      const url = data.href;
      const name = data.linkTitle || '';
      const linkText = block.getText().substring(anchorOffset, focusOffset);
      cover.mentions.push(getMention(name, '', formatMention(url, linkText, order + i, anchorOffset)));
    };

    element.el.findEntityRanges(findEntityOfType('LINK'), mkLink(element.el));
  });
  return cover;
}
