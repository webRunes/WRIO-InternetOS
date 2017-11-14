import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mkActions from './indexActions.js';
import nock from 'nock';
import expect from 'expect'; // You can use any testing library
import JSONDocument from 'base/jsonld/LdJsonDocument';
import { mkDoc } from '../reducers/docUtils';
import { getHtml } from 'CoreEditor/fixtures/fixture';
import { fetchDocument } from './indexActions';

jest.mock('base/mixins/UrlMixin');
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const actions = mkActions('');

process.env = {
  DOMAIN: 'wrioos.com',
  NODE_ENV: 'development',
};

const MOCK_COMMENT_ID = '99991234567890';
const WRIO_ID = '558153389649';
const ARTICLE_DESCRIPTION = 'Lorem ipsum.....';

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch document correctly', async () => {
    const docUrl = 'https://wrioos.com/1.html';
    nock(/wrioos\.com/)
      .get('/1.html')
      .reply(200, getHtml('testdocument'));

    nock('https://storage.wrioos.com/')
      .post('/api/save')
      .reply(200, { result: 'success' });

    const store = mockStore({});
    const action = actions.fetchDocument(docUrl);

    await store.dispatch(action);
    const resActions = store.getActions();

    console.log(resActions);

    expect(resActions[0].type).toEqual('REQUEST_DOCUMENT');
    expect(resActions[1].type).toEqual('DESC_CHANGED');
  });
});
