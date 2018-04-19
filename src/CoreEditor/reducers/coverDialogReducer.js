/**
 * Created by michbil on 16.07.17.
 */

import {
  COVER_DIALOG_OPEN,
  COVER_DIALOG_CLOSE,
  COVER_NEW_TAB,
  COVER_TAB_CHANGE,
  COVER_DELETE_TAB,
} from '../actions/coverDialog';
import EditorReducerMaker from './editorReducer';
import JSONDocument from 'base/jsonld/LdJsonDocument';
import JSONToDraft from '../DraftConverters/cover/JSONToDraft';
import { mkDoc, extractHeader } from './docUtils';

const DEFAULT_COVER = 'https://default.wrioos.com/img/default_bg.jpg';

function newCover() {
  return {
    '@type': 'ImageObject',
    name: 'Title',
    thumbnail: DEFAULT_COVER,
    contentUrl: DEFAULT_COVER,
    about: 'Subtitle',
    text: ['Text'],
  };
}

let index = 0;

function makeTabsFromCovers(coverElements) {
  return coverElements.map(coverElement => {
    const docs = new JSONDocument([coverElement]);
    const imageUrl = coverElement.contentUrl;
    return {
      ...mkDoc({}, docs, JSONToDraft),
      imageUrl,
      key: `Cover-${index++}`,
      name: 'Cover',
    };
  });
}

function makeTabs() {
  return makeTabsFromCovers([newCover()]);
};

const defaultState = {
  showDialog: false,
  tabs: [],
  tab: { key: 'Cover-0', name: 'Cover ', subEdtior: { editorState: null } },
};

function findTabWithKey(tabs, tabKey) {
  return tabs.filter(e => e.key === tabKey)[0];
}

function findTabsWithoutKey(tabs, tabKey) {
  return tabs.filter(e => e.key !== tabKey);
}

const replaceTabWithKey = (tabs, tab, key) => tabs.map(el => (el.key === key ? tab : el));

export function coverDialogReducer(state = defaultState, action) {
  switch (action.type) {
    case 'COVER_DIALOG_IMAGE_URL_CHANGED': {
      const { key } = state.tab;
      const tab = { ...state.tab, imageUrl: action.url };
      return { ...state, tab, tabs: replaceTabWithKey(state.tabs, tab, key) };
    }
    case COVER_DIALOG_OPEN: {
      const tabs = makeTabs();
      return {
        ...state,
        tabs,
        tab: tabs[0],
        showDialog: true,
      };
    }
    case COVER_DIALOG_CLOSE:
      return { ...state, showDialog: false };

    case COVER_NEW_TAB: {
      const newTab = makeTabsFromCovers([newCover()])[0];
      return { ...state, tab: newTab, tabs: [...state.tabs, newTab] };
    }
    case COVER_TAB_CHANGE:
      return { ...state, tab: findTabWithKey(state.tabs, action.tabKey) };

    case COVER_DELETE_TAB:
      return { ...state, tabs: findTabsWithoutKey(state.tabs, action.tabKey) };

    default: {
      const { key } = state.tab;
      const tab = EditorReducerMaker('COVEREDITOR_')(state.tab, action);
      const tabs = replaceTabWithKey(state.tabs, tab, key);
      return { ...state, tab, tabs };
    }
  }
}

export default coverDialogReducer;
