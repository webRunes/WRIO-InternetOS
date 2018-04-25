import {
  COVER_DIALOG_IMAGE_URL_CHANGED,
  COVER_DIALOG_OPEN,
  COVER_DIALOG_CLOSE,
  COVER_NEW_TAB,
  COVER_TAB_CHANGE,
  COVER_DELETE_TAB,
} from '../actions/coverDialog';
import {
  COVER_CREATE_NEW_LINK,
  COVER_EDIT_LINK,
  COVEREDITOR_CREATE_DOCUMENT,
  COVEREDITOR_REQUEST_DOCUMENT,
  COVEREDITOR_GOT_ERROR,
  COVEREDITOR_GOT_JSON_LD_DOCUMENT,
  COVEREDITOR_EDITOR_CHANGED,
  COVEREDITOR_REMOVE_ENTITY
} from '../actions/coverActions';
import EditorReducerMaker from './editorReducer';
import JSONDocument from 'base/jsonld/LdJsonDocument';
import JSONToDraft from '../DraftConverters/cover/JSONToDraft';
import { mkDoc, extractHeaderFromCover } from './docUtils';
import { createNewLink, editNewLink, removeEntity } from '../utils/entitytools';

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
      key: index,
      name: 'Cover'
    }),
  findTabWithKey = (tabs, key) =>
    tabs.find(tab => tab.key === key),
  replaceTabWithKey = (tabs, tab, key) => tabs.map(el => el.key === key ? tab : el),
  defaultTab = makeCoverTabFromJSONLD(defaultSourceForCoverTabJSONLD, 0),
  defaultState = {
    showDialog: false,
    tabs: [defaultTab],
    tab: defaultTab
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
      const
        length = state.tabs.length,
        lastKey = state.tabs[length - 1].key,
        newTab = makeCoverTabFromJSONLD(defaultSourceForCoverTabJSONLD, lastKey + 1);
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
        nextActiveTab = newTabs[indexTabToDelete] || newTabs[newTabs.length - 1] || defaultTab,
        showDialog = newTabs.length > 0;

      return {
        ...state,
        tab: nextActiveTab,
        tabs: showDialog ? newTabs : [nextActiveTab],
        showDialog: showDialog
      }
    }
    case COVER_CREATE_NEW_LINK: {
      const
        editorState = createNewLink(state.tab.editorState, action.title, action.url, action.desc),
        tab = {
          ...state.tab,
          editorState
        },
        tabs = replaceTabWithKey(state.tabs, tab, tab.key);

      return {
        ...state,
        tab,
        tabs
      }
    }
    case COVER_EDIT_LINK: {
      editNewLink(
        action.title,
        action.url,
        action.desc,
        action.linkEntityKey
      );
      return state
    }
    case COVEREDITOR_CREATE_DOCUMENT: {
      const newDoc = new JSONDocument([createArticleTemplate(action.author, '')]);
      return mkDoc(state, newDoc)
    }
    case COVEREDITOR_REQUEST_DOCUMENT: {
      return { ...state, isFetching: true }
    }
    case COVEREDITOR_GOT_ERROR: {
      return { ...state, isFetching: false, error: action.error }
    }
    case COVEREDITOR_EDITOR_CHANGED: {
      const
        editorState = action.editorState,
        tab = {
          ...state.tab,
          editorState
        },
        tabs = replaceTabWithKey(state.tabs, tab, tab.key);

      return extractHeaderFromCover({
        ...state,
        tab,
        tabs
      })
    }
    case COVEREDITOR_REMOVE_ENTITY: {
      const
        tab = {
          ...state.tab,
          editorState: removeEntity(state.tab.editorState, action.key)
        },
        tabs = replaceTabWithKey(state.tabs, tab, tab.key);

      return {
        ...state,
        tab,
        tabs
      }
    }
    default: {
      return state
    }
  }
}

export default coverDialogReducer;
