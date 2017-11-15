import LdJsonDocument from 'base/jsonld/LdJsonDocument.js';
import JSONToDraft from './JSONToDraft';
import { ContentState } from 'draft-js';
import DraftToJSON from './DraftToJSON';

import getFixture from '../../fixtures/fixture.js';

test('Convert JSON contentblocks to Draft and back to JSON', () => {
  const json = getFixture('testjson');
  const article = new LdJsonDocument(json);
  const {
    contentBlocks, images, mentions, socials, blockKeyToOrderMap,
  } = JSONToDraft(article);

  console.log(images, mentions, socials, blockKeyToOrderMap);

  const newJson = DraftToJSON(ContentState.createFromBlockArray(contentBlocks), article);
  console.log(newJson);
});
