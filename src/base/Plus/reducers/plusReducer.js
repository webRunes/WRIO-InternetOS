import actions from 'base/actions/actions';
import normURL, { isPlusUrl, getPlusUrl } from '../utils/normURL';
import * as PlusActions from '../actions/PlusActions.js';
import { getJsonldsByUrl, getJsonldsByUrlPromised, lastOrder, getNext } from '../utils/tools';
import { CrossStorageFactory } from '../../utils/CrossStorageFactory.js';

import {
  addPageToTabs,
  getActiveElement,
  deletePageFromTabs,
  normalizeTabs,
  saveCurrentUrlToPlus,
} from '../utils/tabTools.js';

const storage = CrossStorageFactory.getCrossStorage();

/**
 * Extracts current page information from the DOM
 * TODO: avoid direct DOM manipulation, need to pass this to the DOM
 * TODO: remove this legacy piece of shit
 * @returns {*}
 */

const extractCurrentPageInformation = () => {
  const scripts = document.getElementsByTagName('script');
  let result;
  for (let i = 0; i < scripts.length; i += 1) {
    if (scripts[i].type === 'application/ld+json') {
      let json;
      try {
        json = JSON.parse(scripts[i].textContent);
      } catch (exception) {
        json = undefined;
        console.error(`Your json-ld not valid: ${exception}`);
      }
      if (typeof json === 'object' && json['@type'] === 'ItemList') {
        result = {
          name: json.name,
          url: normURL(window.location.href),
          fullUrl: window.location.href,
          author: json.author,
          active: true,
        };
      }

      if (typeof json === 'object' && json['@type'] === 'Article') {
        result = {
          name: json.name,
          url: normURL(window.location.href),
          fullUrl: window.location.href,
          author: json.author,
          active: true,
        };
        break;
      }
    }
  }
  return result;
};

function getActiveTab(data) {
  let childActive = [];
  const getChildren = (data) => {
    if (typeof data === 'object') {
      return Object.values(data);
    }
    return [];
  };
  if (data) {
    Object.keys(data).forEach((name) => {
      if (data[name].active) {
        childActive = getChildren(data[name].children);
        console.log('Active plus branch', data[name]);
      }
    });
  }
  return childActive;
}

function isPlusActive(wrioID) {
  return isPlusUrl(window.location.href, wrioID);
}

const defaultState = {
  plusTabs: {},
  readItLater: [],
};

function checkHaveEverything(state) {
  if ((state.authorData || state.noAuthor) && state.plusData) {
    const _tabs = importPlusState(state.plusData, !isPlusActive(state.wrioID), state.authorData); // don't add current page to tabs if plus active
    delete state.plusData;
    return {
      ...state,
      plusTabs: _tabs,
      readItLater: getActiveTab(_tabs),
    };
  }
  return state;
}

export default function plusReducer(state = defaultState, action) {
  console.log('ST', state);
  let _state;
  switch (action.type) {
    case 'GET_AUTHOR_DATA':
      _state = checkHaveEverything({
        ...state,
        authorData: action.authorData,
        noAuthor: action.noAuthor,
      });
      return _state;
    case PlusActions.GOT_PLUS_DATA:
      _state = checkHaveEverything({
        ...state,
        plusData: action.plus,
        wrioID: action.wrioID,
      });
      return _state;
    default:
      return state;
  }
  return state;
}

// TODO: it's sick and wrong to do it in reducer, sorry
async function persistPlusDataToLocalStorage(data) {
  await storage.onConnect();
  await storage.set('plus', data);
}

function importPlusState(data, addCurrent, author) {
  const _norm = normalizeTabs(data);
  const params = createCurrentPage(author);
  if (params && addCurrent) {
    const newData = addPageToTabs(_norm, params);
    persistPlusDataToLocalStorage(newData);
    return newData;
  }
  return _norm;
}

function createCurrentPageParent(page: Object, author: LdJsonDocument) {
  console.log('CCPT', page, author);
  if (!page.author || page.author == 'unknown' || !author) {
    return {
      tab: page,
      noAuthor: true,
    };
  }
  return {
    tab: page,
    parent: author.getProperty('author'),
  };
}

function createCurrentPage(author) {
  const pageData = extractCurrentPageInformation();
  if (pageData) {
    if (
      pageData.author &&
      typeof pageData.author === 'string' &&
      normURL(pageData.author) !== normURL(pageData.url)
    ) {
      return createCurrentPageParent(pageData, author);
    }
    return {
      tab: pageData,
      noAuthor: true,
    };
  }
}
