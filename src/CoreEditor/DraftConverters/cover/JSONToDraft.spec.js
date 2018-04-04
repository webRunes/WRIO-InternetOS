import LdJsonDocument from 'base/jsonld/LdJsonDocument.js';
import JSONToDraft from './JSONToDraft';
import { ContentState } from 'draft-js';
import DraftToJSON from './DraftToJSON';

import getFixture from '../../fixtures/fixture.js';

test('Convert JSON contentblocks to Draft and back to JSON', () => {
  const json = {
    '@type': 'ImageObject',
    name: 'webRunes',
    thumbnail: 'https://webrunes.com/img/cover1-200x200.png',
    contentUrl: 'https://webrunes.com/img/cover1.jpg',
    about: 'Lifelong learning is our credo, our mission is to enlighten people',
    text: [
      'webRunes is the first contractor for Alternative project. And we are the first ad hoc team of freelancers specializing in various IT fields and other areas of expertise that are developing WRIO Internet OS platform. WRIO Internet OS is a gate to semantic, decentralized and secure Internet. The platform is required for the technical implementation of Alternative — a set of projects aimed at the development of a free self-managed society, an alternative approach to the interaction of people with minimal or even without participation of the government.',
      'Development principles:',
      '* freedom',
      '* openness',
      '* knowledge must flow',
      '* cooperation',
      '* ad hoc',
      '* transparency',
      '* the modularity',
    ],
    mentions: [
      {
        '@type': 'Article',
        name: 'Decentralized autonomous organization',
        about:
          'A decentralized autonomous organization (DAO), also known as decentralized autonomous corporation (DAC), is an organization that is run through a set of business rules that operate within computer code (smart contracts).',
        url:
          "https://en.wikipedia.org/wiki/Decentralized_autonomous_organization?'Decentralized Autonomous Organizations':3,29,external",
      },
      {
        '@type': 'Article',
        name: 'Blockchain',
        about:
          'A block chain, or blockchain, is a distributed database that maintains a continuously-growing list of data records hardened against tampering and revision. It consists of data structure blocks—which hold exclusively data in initial blockchain implementations, and both data and programs in some (for example, Ethereum) of the more recent implementations—with each block holding batches of individual transactions and the results of any blockchain executables. Each block contains a timestamp and information linking it to a previous block.',
        url: "https://en.wikipedia.org/wiki/Block_chain_%28database%29?'blockchain':3,100,external",
      },
    ],
  };
  const article = new LdJsonDocument([json]);
  const {
    contentBlocks, images, mentions, socials, blockKeyToOrderMap,
  } = JSONToDraft(article);

  console.log(images, mentions, socials, blockKeyToOrderMap);

  const newJson = DraftToJSON(ContentState.createFromBlockArray(contentBlocks), article);
  console.log(newJson);
});
