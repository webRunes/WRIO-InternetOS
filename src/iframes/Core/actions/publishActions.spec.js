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
    NODE_ENV: "production"
}

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('should publish document correctly', () => {
      //
     nock('https://titter.${domain}/')
      .get('/obtain_widget_id')
      .reply(200, "1234567890")

    nock('https://storage.wrioos.com/')
      .get('/api/save')
      .reply(200, { result: "success" } )

    const expectedActions = [
          {"type":"PUBLISH_DOCUMENT"},{"type":"PUBLISH_FINISH"}
    ]
    
    const store = mockStore(mockState);

    return store.dispatch(actions.publishDocument()).then(() => {
      // return of async actions
      const resActions = store.getActions();

      expect(resActions).toEqual(expectedActions);
    })
  })
})

const doc = new JSONDocument();
doc.createArticle("https://wr.io/0123456789/?wr.io=0123456789", "")
const mockState = {
  "document": mkDoc({},doc),
  "publish": {
    "editParams": {
      "createMode": true,
      "initEditURL": null,
      "initEditPath": null
    },
    "description": "",
    "commentsEnabled": false,
    "filename": "Untitled",
    "savePath": "Untitled/index.html",
    "saveURL": "",
    "userStartedEditingFilename": false,
    "saveSource": "S3",
    "saveUrl": "https://wr.io/558153389649/Untitled/index.html",
    "wrioID": "558153389649",
    "busy": false
  }
}