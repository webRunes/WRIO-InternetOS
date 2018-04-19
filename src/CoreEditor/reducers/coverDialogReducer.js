import {
  COVER_DIALOG_IMAGE_URL_CHANGED,
  COVER_DIALOG_OPEN,
  COVER_DIALOG_CLOSE,
  COVER_NEW_TAB,
  COVER_TAB_CHANGE,
  COVER_DELETE_TAB,
} from '../actions/coverDialog';
import EditorReducerMaker from './editorReducer';
import JSONDocument from 'base/jsonld/LdJsonDocument';
import JSONToDraft from '../DraftConverters/cover/JSONToDraft';
import { mkDoc } from './docUtils';

const
  defaultSourceForCoverTabJSONLD = {
    '@type': 'ImageObject',
    name: 'Title',
    thumbnail: 'https://default.wrioos.com/img/default_bg.jpg',
    contentUrl: 'https://default.wrioos.com/img/default_bg.jpg',
    about: 'Subtitle',
    text: ['Text']
  },
  makeCoverTabFromJSONLD = (jsonld, index) =>
    Object({
      ...mkDoc({}, new JSONDocument([jsonld]), JSONToDraft),
      imageUrl: jsonld.contentUrl,
      key: 'Cover-' + index,
      name: 'Cover'
    }),
  findTabWithKey = (tabs, tabKey) =>
    tabs.filter(e => e.key === tabKey)[0],
  findTabsWithoutKey = (tabs, tabKey) =>
    tabs.filter(e => e.key !== tabKey),
  replaceTabWithKey = (tabs, tab, key) => tabs.map(el => el.key === key ? tab : el),
  defaultState = {
    showDialog: false,
    tabs: [makeCoverTabFromJSONLD(defaultSourceForCoverTabJSONLD)],
    tab: this.tabs[0],
  };

export function coverDialogReducer(state = defaultState, action) {
  switch (action.type) {
    case COVER_DIALOG_IMAGE_URL_CHANGED: {
      const { key } = state.tab;
      const tab = { ...state.tab, imageUrl: action.url };
      return { ...state, tab, tabs: replaceTabWithKey(state.tabs, tab, key) };
    }
    case COVER_DIALOG_OPEN: {
      return {
        ...state,
        showDialog: true,
      }
    }
    case COVER_DIALOG_CLOSE: {
      return {
        ...state,
        showDialog: false
      }
    }
    case COVER_NEW_TAB: {
      const newTab = makeCoverTabFromJSONLD(defaultSourceForCoverTabJSONLD);
      return {
        ...state,
        tab: newTab,
        tabs: [...state.tabs, newTab]
      }
    }
    case COVER_TAB_CHANGE: {
      return {
        ...state,
        tab: findTabWithKey(state.tabs, action.tabKey)
      }
    }
    case COVER_DELETE_TAB: {
      const
        indexTabToDelete = state.tabs.findIndex(tab => tab.key === action.tabKey),
        newTabs = state.tabs.slice(0, indexTabToDelete).concat(state.tabs.slice(indexTabToDelete + 1)),
        nextActiveTab = newTabs[indexTabToDelete] || newTabs[newTabs.length - 1];

      return {
        ...state,
        tab: nextActiveTab,
        tabs: newTabs
      }
    }
    default: {
      const { key } = state.tab;
      const tab = EditorReducerMaker('COVEREDITOR_')(state.tab, action);
      const tabs = replaceTabWithKey(state.tabs, tab, key);
      return { ...state, tab, tabs }
    }
  }
}

export default coverDialogReducer;
