/**
 * Created by michbil on 16.07.17.
 */

import { COVER_DIALOG_OPEN, COVER_DIALOG_CLOSE } from '../actions/coverDialog';
import EditorReducerMaker from './editorReducer';
import JSONDocument from '../JSONDocument.js';
import { mkDoc, extractHeader } from './docUtils';

const DEFAULT_COVER =
  'http://cdn.audubon.org/cdn/farfuture/CVt0eUFTB4D8hO6maFhtbL_YYlONSrMWBTv6dTIfbCs/mtime:1497975916/sites/default/files/styles/hero_image/public/web_gbbc_cedar_waxwing_4_ben-thomas_ga_2012_kk.jpg?itok=sKUsfgjj';

const CoverEditorReducer = function CoverEditorReducer(state, action) {
  switch (action.type) {
    case 'COVER_DIALOG_OPEN': {
      let docs;
      if (action.cover) {
        docs = new JSONDocument([JSONDocument.createFromCover(action.cover)]);
      } else {
        docs = new JSONDocument([JSONDocument.newCover()]);
      }
      const doctempl = mkDoc(state, docs);
      return doctempl;
    }
    default:
      return EditorReducerMaker('COVEREDITOR_')(state, action);
  }
};

const defaultState = {
  showDialog: false,
  imageUrl: '',
  subEdtior: CoverEditorReducer(undefined, { type: '@INIT' }),
};

export function coverDialogReducer(state = defaultState, action) {
  switch (action.type) {
    case 'COVER_DIALOG_IMAGE_URL_CHANGED':
      return { ...state, imageUrl: action.url };
    case COVER_DIALOG_OPEN: {
      const subEdtior1 = CoverEditorReducer(state.subEdtior, action);
      const imageUrl = action.cover ? action.cover.itemListElement[0].contentUrl : DEFAULT_COVER;
      return {
        ...state,
        imageUrl,
        subEdtior: subEdtior1,
        showDialog: true,
      };
    }
    case COVER_DIALOG_CLOSE:
      return { ...state, showDialog: false };

    default: {
      const subEdtior = CoverEditorReducer(state.subEdtior, action);
      return { ...state, subEdtior };
    }
  }
}

export default coverDialogReducer;
