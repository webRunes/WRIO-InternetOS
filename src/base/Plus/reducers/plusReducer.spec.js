import assert from 'assert';
import should from 'should';
import { setMock } from '../../utils/CrossStorageFactory.js';
import plusReducer from './plusReducer.js';

const mockval = {
  plus: {
    'webrunes.com': {
      name: 'webRunes',
      url: 'webrunes.com',
      order: 0,
    },
    'wrioos.com': {
      name: 'WRIO OS',
      url: 'wrioos.com',
      order: 1,
    },
    'webrunes.com/blog.htm': {
      name: 'Blogs',
      url: 'webrunes.com/blog.htm',
      author: 'webrunes.com',
      order: 2,
      active: true,
    },
  },
};

import { loginMessage } from 'base/actions/WindowMessage';

import {
  addPageToTabs,
  hasActive,
  removeLastActive,
  deletePageFromTabs,
  normalizeTabs,
  saveCurrentUrlToPlus,
} from '../utils/tabTools.js';

it('Should create jsonld store, and get plus from crossStorage', () => {
  setMock(mockval);
  // loginMessage.onNext({wrioID:'558153389649',temporary:false,profile: {}}); // fake got wrio id request
  const state = plusReducer(undefined, { type: 'DUMMY_ACTION' });
  expect(state).not.toEqual(undefined);
});
