export const ADD_COVER = 'ADD_COVER';
export const SELECT_COVER = 'SELECT_COVER';
export const PRESS_COVER_BUTTON = 'PRESS_COVER_BUTTON';
export const COVER_CREATE_NEW_LINK = 'COVER_CREATE_NEW_LINK';
export const COVER_EDIT_LINK = 'COVER_EDIT_LINK';

export const COVEREDITOR_CREATE_DOCUMENT = 'COVEREDITOR_CREATE_DOCUMENT';
export const COVEREDITOR_REQUEST_DOCUMENT = 'COVEREDITOR_REQUEST_DOCUMENT';
export const COVEREDITOR_GOT_ERROR = 'COVEREDITOR_GOT_ERROR';
export const COVEREDITOR_GOT_JSON_LD_DOCUMENT = 'COVEREDITOR_GOT_JSON_LD_DOCUMENT';
export const COVEREDITOR_EDITOR_CHANGED = 'COVEREDITOR_EDITOR_CHANGED';
export const COVEREDITOR_REMOVE_ENTITY = 'COVEREDITOR_REMOVE_ENTITY';

export const editCover = function editCover(coverId: string) {};

export const editLink = function editLink(titleValue, urlValue, descValue, linkEntityKey) {
  Entity.mergeData(linkEntityKey, {
    linkTitle: titleValue,
    href: urlValue,
    linkDesc: descValue,
  });

  return { type: COVER_EDIT_LINK };
};

export const createNewLink = function createNewLink(title, url, desc) {
  return {
    type: COVER_CREATE_NEW_LINK,
    title,
    url,
    desc,
  };
};

export const editorChanged = function editorChanged(editorState) {
    return {
      type: COVEREDITOR_EDITOR_CHANGED,
      editorState
    }
};
