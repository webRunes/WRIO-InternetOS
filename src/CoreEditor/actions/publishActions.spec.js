import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './publishActions.js';
import nock from 'nock';
import expect from 'expect'; // You can use any testing library
import DraftExporter, { makeArticle } from '../DraftExporter';
import LdJsonDocument from 'base/jsonld/LdJsonDocument';
import { mkDoc } from '../reducers/docUtils';
import { fakeWidgetId } from './publishActions.js';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

process.env = {
  DOMAIN: 'wrioos.com',
  NODE_ENV: 'development',
};

const WRIO_ID = '558153389649';
const ARTICLE_DESCRIPTION = 'Lorem ipsum.....';

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should publish document correctly', () => {
    nock('https://storage.wrioos.com/')
      .post('/api/save')
      .times(2) // save main and cover!
      .reply(200, { result: 'success' });

    const expectedActions = [{ type: 'PUBLISH_DOCUMENT' }, { type: 'PUBLISH_FINISH', json: [] }];

    const store = mockStore(mockState);

    return store.dispatch(actions.publishDocument('S3')).then(() => {
      // return of async actions
      const resActions = store.getActions();

      expect(resActions[0].type).toEqual('PUBLISH_DOCUMENT');
      expect(resActions[1].type).toEqual('PUBLISH_FINISH');

      const { document } = resActions[1];
      console.log(document);
      expect(document.getProperty('author')).toEqual('https://wr.io/558153389649/?wr.io=558153389649');
      expect(document.getProperty('about')).toEqual(ARTICLE_DESCRIPTION);
      expect(document.getProperty('comment')).toEqual(fakeWidgetId);
    });
  });
});

const doc = new LdJsonDocument([makeArticle('en', '', '', '', '')]);

const mockState = {
  editorDocument: mkDoc({}, doc),
  publish: {
    editParams: {
      createMode: true,
      initEditURL: null,
      initEditPath: null,
    },
    description: ARTICLE_DESCRIPTION,
    commentsEnabled: true,
    filename: 'Untitled',
    savePath: 'Untitled/index.html',
    saveURL: '',
    userStartedEditingFilename: false,
    saveSource: 'S3',
    saveUrl: 'https://wr.io/558153389649/Untitled/index.html',
    wrioID: WRIO_ID,
    busy: false,
  },
};
