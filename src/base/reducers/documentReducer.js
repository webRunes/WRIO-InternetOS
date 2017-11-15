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
    case actions.GOT_EXTERNAL:
      return {
        ...state,
        lists: action.lists,
      };
    case actions.LOGIN_MESSAGE:
      if (action.msg.profile) {
        const profile = action.msg.profile;
        const _author = getAuthor(state.mainPage);
        console.log(state.mainPage);
        console.log('Checking if editing allowed: ', profile.url, _author);
        const editAllowed = UrlMixin.compareProfileUrls(profile.url, _author);
        return {
          ...state,
          busy: false,
          editAllowed,
        };
      }
    case actions.TAB_CLICK:
      return { ...state, tabKey: action.tabKey };

    case actions.NAVIGATE_ARTICLE_HASH:
      return {
        ...state,
        tabKey: 'home',
        toc: extractPageNavigation(state.mainPage, false), // recalculate all items active state
      };

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
  return doc.getProperty('author');
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
