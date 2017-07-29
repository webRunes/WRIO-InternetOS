import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './publishActions.js'
import nock from 'nock'
import expect from 'expect' // You can use any testing library
import JSONDocument from '../JSONDocument'
import {mkDoc} from '../reducers/docUtils'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

process.env = {
    DOMAIN: "wrioos.com",
    NODE_ENV: "development"
}

const MOCK_COMMENT_ID = "99991234567890";
const WRIO_ID = "558153389649";
const ARTICLE_DESCRIPTION = "Lorem ipsum.....";

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('should publish document correctly', () => {
      //
     nock('https://titter.wrioos.com/')
      .get(/\/obtain_widget_id.*/)
      .reply(200, MOCK_COMMENT_ID)

    nock('https://storage.wrioos.com/')
      .post('/api/save')
      .reply(200, { result: "success" } )

    const expectedActions = [
          {"type":"PUBLISH_DOCUMENT"},
          {"type":"PUBLISH_FINISH",json: []}
    ]
    
    const store = mockStore(mockState);

    return store.dispatch(actions.publishDocument()).then(() => {
      // return of async actions
      const resActions = store.getActions();

      expect(resActions[0].type).toEqual('PUBLISH_DOCUMENT');
      expect(resActions[1].type).toEqual('PUBLISH_FINISH');

      const {json} = resActions[1];
      console.log(json);
      expect(json[0].author).toEqual('https://wr.io/558153389649/?wr.io=558153389649')
      expect(json[0].about).toEqual(ARTICLE_DESCRIPTION)
      expect(json[0].comment).toEqual(MOCK_COMMENT_ID)
      
    })
  })
})

const doc = new JSONDocument();
doc.createArticle(WRIO_ID, "")
const mockState = {
  "document": mkDoc({},doc),
  "publish": {
    "editParams": {
      "createMode": true,
      "initEditURL": null,
      "initEditPath": null
    },
    "description": ARTICLE_DESCRIPTION,
    "commentsEnabled": true,
    "filename": "Untitled",
    "savePath": "Untitled/index.html",
    "saveURL": "",
    "userStartedEditingFilename": false,
    "saveSource": "S3",
    "saveUrl": "https://wr.io/558153389649/Untitled/index.html",
    "wrioID": WRIO_ID,
    "busy": false
  }
}