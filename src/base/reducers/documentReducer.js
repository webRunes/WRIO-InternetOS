/* @flow */
/**
 * Created by michbil on 30.03.16.
 */
import { CrossStorageFactory } from '../utils/CrossStorageFactory.js';
// $FlowFixMe
import Reflux from 'reflux';
import getHttp from '../utils/request.js';
import UrlMixin from '../mixins/UrlMixin';
import LdJsonObject from '../jsonld/entities/LdJsonObject';
import LdJsonDocument from '../jsonld/LdJsonDocument';
import TableOfContents, { MenuItem, extractPageNavigation } from '../utils/tocnavigation';
import { replaceSpaces } from '../mixins/UrlMixin';
import PlusActions from '../Plus/actions/PlusActions';
import * as actions from 'base/actions/actions';

/**
 * Store that handles state of entire WRIO-document
 */

type ContentsType = {
  covers: Array<MenuItem>,
  chapters: Array<MenuItem>,
  external: Array<MenuItem>,
};

type DocumentState = {
  editAllowed: boolean,
  // $FlowFixMe
  mainPage: LdJsonDocument,
  lists: Array<LdJsonDocument>,
  toc: ContentsType,
  url: string,
  wrioID: ?string, // current logged in user WRIO-ID
  profile: ?Object,
  feed: Array<any>,
  sensorData: Array<any>,
  geoCoordinates: Array<any>
};

const defaultState: DocumentState = {
  editAllowed: false,
  lists: [],
  url: window.location.href,
  mainPage: null,
  profile: null,
  tabKey: 'home',
  wrioID: null,
  toc: {
    covers: [],
    chapters: [],
    external: [],
  },  
  feed: [],
  sensorData:[],
  geoCoordinates: []
};

function DocumentReducer(state: DocumentState = defaultState, action: Object) {
  switch (action.type) {
    case actions.GOT_JSON_LD_DOCUMENT:
      return {
        ...state,
        mainPage: action.data,
        url: action.url,
        toc: action.toc || extractPageNavigation(action.document, true),
      };
    case actions.GOT_EXTERNAL: // TODO: is this still needed??????
      return {
        ...state,
        lists: action.lists,
      };
    case actions.LOGIN_MESSAGE:
      return action.msg.profile
        ?
          {
            ...state,
            busy: false,
            editAllowed: UrlMixin.compareProfileUrls(
              action.msg.profile.url,
              getAuthor(state.mainPage)
            ),
          }
        :
          state
    case actions.TAB_CLICK:
      return { ...state, tabKey: action.tabKey };

    case actions.NAVIGATE_ARTICLE_HASH:
      return state.mainPage
        ?
          {
            ...state,
            tabKey: 'home',
            toc: extractPageNavigation(state.mainPage, false), // recalculate all items active state
          }
        :
          state;

    case actions.GOT_FEED:
      return {
        ...state,
        feed: action.payload.feed.data[0],
        feedProductData: action.payload.feed.data[1],
        geoCoordinates: [
          +action.payload.feed.data[2].longitude,         
          +action.payload.feed.data[2].latitude,
        ]
       }

    case actions.GOT_SENSOR_FEED:
      console.log('state ========== sensor feed', state);
      return {
        ...state,
        sensorData: [...state.sensorData,{ 
          payload: action.payload.sensorData.data[0],
          productData:action.payload.sensorData.data[1],
          url: action.payload.url
        }],
          geoCoordinates: [
            ...state.geoCoordinates,
            {
              feedUrl: action.payload.url,
              longitude:+action.payload.sensorData.data[2].longitude,         
              latitude:+action.payload.sensorData.data[2].latitude,
            },
          ]
       }

    default:
      return state;
  }
}

/**
 *
 * @param {*} url
 * @param {*} mainPage
 */
export function getAuthor(doc: LdJsonDocument): ?string {
  return doc && doc.getProperty('author');
}

/*
class WrioDocument extends Reflux.Store {


    // methods what was in the center.js store
    _setUrlWithParams (type: string, name : string, isRet: boolean) {
        // TODO type have no meaning in current realization
        var search = '?list=' + name,
            path = window.location.pathname + search;
        if (isRet) {
            return path;
        } else {
            window.history.pushState('page', 'params', path);
        }
    }


    // this actions are called when browsing through the right menu

    onExternal (url: string, name: string, isRet : boolean, cb: Function) {
        console.log("====OnEXTERNAL",name);
        var type = 'external';
        cb ? cb(this._setUrlWithParams(type, name, isRet)) : this._setUrlWithParams(type, name, isRet);
    }

    onCover (url: string, name: string, init: boolean, isRet: boolean) {
        console.log("====OnCOVER");
        if (!init) {
            this._setUrlWithParams('cover', name, isRet);
        }
    }


    // Manage tabs!

    onTabClick(key : string) {
        console.log("TK", key);
        this.trigger();
    }

};

*/

export default DocumentReducer;
