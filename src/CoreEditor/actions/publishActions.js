// @flow
import { Entity } from 'draft-js';
import { saveToS3, deleteFromS3, getWidgetID } from '../webrunesAPI.js';
import { formatAuthor } from '../utils/url.js';
import DraftExporter from '../DraftExporter';
import ListExporter from '../ListExporter';
import { saveCovers } from './coverDialog';
export const fakeWidgetId = '875721502196465664';

export const DESC_CHANGED = 'DESC_CHANGED';
export const FILENAME_CHANGED = 'FILENAME_CHANGED';
export const HEADER_CHANGED = 'HEADER_CHANGED';

export const PUBLISH_DOCUMENT = 'PUBLISH_DOCUMENT';
export const PUBLISH_FINISH = 'PUBLISH_FINISH';
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT';
export const ENABLE_COMMENTS = 'ENABLE_COMMENTS';
export const PUBLISH_COVER = 'PUBLISH_COVER';

export const GOT_ERROR = 'PUBLISH_GOT_ERROR';

export const GOT_URLPARAMS = 'GOT_URLPARAMS';
export const RECEIVE_USER_DATA = 'RECEIVE_USER_DATA';
export const PICK_SAVE_SOURCE = 'PICK_SAVE_SOURCE';


export function gotUrlParams(createMode: boolean, editURL: ?string, editPath: ?string) {
  return {
    type: GOT_URLPARAMS,
    createMode,
    editURL,
    editPath,
  };
}

export function publishDocument(saveSource: string) {
  return async (dispatch: Function, getState: Function) => {
    dispatch({ type: PUBLISH_DOCUMENT });
    try {
      const state: Object = getState();
      const { document, editorState } = state.editorDocument;
      const exporter = new DraftExporter(document);
      const {
        commentsEnabled,
        savePath,
        saveUrl,
        wrioID,
        coverSavePath,
        description,
        coverHtml,
        coverFileName,
        deleteCover
      } = state.publish;

      document.setAbout(description);

      const html = exporter.articleDraftToHtml(
        editorState.getCurrentContent(),
        formatAuthor(wrioID),
        '',
        coverHtml ? coverSavePath : undefined,
        state.externalsEditor,
      );
      const saveRes = await saveToS3(savePath, html);
      console.log('SAVER RESULT', saveRes.body);
      if (deleteCover) {
        const coverDeleteRes = await deleteFromS3(coverFileName);
        console.log('COVER DELETE RESULT', coverDeleteRes.body);
      } else if (coverHtml) {
        const coverSaveRes = await saveToS3(coverFileName, coverHtml);
        console.log('COVER SAVE RESULT', coverSaveRes.body);
      }

      window.location = saveUrl; // let's transition to the new URL

      dispatch({ type: PUBLISH_FINISH});
    } catch (err) {
      console.error('Caught error during publish', err);
      dispatch({ type: GOT_ERROR });
      alert('Publish failed');
    }
  };
}

export function publishDocumentSaveAsCover() {
  return async (dispatch: Function, getState: Function) => {
    dispatch({ type: PUBLISH_DOCUMENT });
    try {
      const state: Object = getState();
      const { document, editorState } = state.editorDocument;
      const exporter = new DraftExporter(document);
      const {
        commentsEnabled,
        savePath,
        saveUrl,
        wrioID,
        coverSavePath,
        description,
        coverHtml
      } = state.publish;

      const documentName = document && document.getProperty('name');
      const documentFileName = name
        ? name.split(' ').join('_')
        : 'untitled';
      const fileName = documentFileName + '_cover.html';

      saveAs(fileName, coverHtml);

      dispatch({ type: PUBLISH_FINISH});
    } catch (err) {
      console.error('Caught error during publish', err);
      dispatch({ type: GOT_ERROR });
      alert('Publish failed');
    }
  };
}

export function publishDocumentSaveAsArticle() {
  return async (dispatch: Function, getState: Function) => {
    dispatch({ type: PUBLISH_DOCUMENT });
    try {
      const state: Object = getState();
      const { document, editorState } = state.editorDocument;
      const exporter = new DraftExporter(document);
      const {
        commentsEnabled,
        savePath,
        saveUrl,
        wrioID,
        coverSavePath,
        description,
        coverHtml,
        coverFileName,
      } = state.publish;

      document.setAbout(description);

      const name = document && document.getProperty('name');

      console.log("Here is the ID and the path")
      console.log((wrioID));
      console.log(savePath);
      const html = exporter.articleDraftToHtml(
        editorState.getCurrentContent(),
        formatAuthor(wrioID),
        '',
        coverHtml ? coverSavePath : undefined,
        state.externalsEditor,
      );
      const fileName = `${name ? name.split(' ').join('_') : 'untitled'}.html`;

      saveAs(fileName, html);

      dispatch({ type: PUBLISH_FINISH});
    } catch (err) {
      console.error('Caught error during publish', err);
      dispatch({ type: GOT_ERROR });
      alert('Publish failed');
    }
  };
}

export function publishCover(html, deleteCover) {
  return async (dispatch: Function, getState: Function) => {
    dispatch({ type: PUBLISH_COVER, html, deleteCover });
  };
}

/**
 * Publish list logic
 * requests commentID from the server, if not supplied
 */
export function publishList(saveSource: string) {
  return async (dispatch: Function, getState: Function) => {
    dispatch({ type: PUBLISH_DOCUMENT });
    try {
      const { listEditor, editorDocument, publish } = getState();
      const { document } = editorDocument;
      const {
        savePath,
        saveUrl,
        coverHtml,
        coverFileName,
        wrioID
      } = publish;
      const exporter = new ListExporter(wrioID);
      const html = exporter.listToHtml(listEditor);

      if (saveSource === 'S3') {
        const saveRes = await saveToS3(savePath, html);
        console.log('SAVER RESULT', saveRes.body);
        if (coverHtml) {
          const coverSaveRes = await saveToS3(coverFileName, coverHtml);
          console.log('COVER SAVE RESULT', coverSaveRes.body);
        }

        window.location = saveUrl;
      } else {
        const name = document && document.getProperty('name');
        const fileName = `${name ? name.split(' ').join('_') : 'untitled'}.html`;
        saveAs(fileName, html);
      }

      dispatch({ type: PUBLISH_FINISH, document });
    } catch (err) {
      console.error('Caught error during publish', err);
      dispatch({ type: GOT_ERROR });
      alert('Publish failed');
    }
  };
}

export const publishWrapper = saveSource => (dispatch, getState) => {
  const { listEditor } = getState();
  if (listEditor) {
    dispatch(publishList(saveSource));
  } else {
    dispatch(saveCovers());
    dispatch(publishDocument());
  }
};

export const publishWrapperSaveAsCover = () => (dispatch, getState) => {
  dispatch(saveCovers());
  dispatch(publishDocumentSaveAsCover());
};

export const publishWrapperSaveAsArticle = () => (dispatch, getState) => {
  dispatch(publishDocumentSaveAsArticle());
};

export function pickSaveSource(source: string) {
  return {
    type: PICK_SAVE_SOURCE,
    source,
  };
}

export function deleteDocument() {
  return (dispatch: Function, getState: Function) => {
    console.log(getState());
  };
}

export function enableComments(state: boolean) {
  return {
    type: ENABLE_COMMENTS,
    state,
  };
}

export function descChanged(text: string) {
  return {
    type: DESC_CHANGED,
    text,
  };
}

export function filenameChanged(text: string) {
  return {
    type: FILENAME_CHANGED,
    text,
  };
}

function saveAs(fileName, html) {
  const destroyClickedLink = (event) => {
    document.body.removeChild(event.target);
  };

  let ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
    ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
    ieEDGE = navigator.userAgent.match(/Edge/g),
    ieVer = ie ? parseInt(ie[1]) : ie11 ? 11 : -1;
  if (ie || ie11 || ieEDGE) {
    if (ieVer > 9 || ieEDGE) {
      var textFileAsBlob = new Blob([html], {
        type: 'text/plain',
      });
      window.navigator.msSaveBlob(textFileAsBlob, fileName);
    } else {
      console.log('IE v.10 or higher required');
    }
  } else {
    const downloadLink = document.createElement('a');
    downloadLink.download = fileName;
    downloadLink.innerHTML = 'My Hidden Link';
    window.URL = window.URL || window.webkitURL;
    textFileAsBlob = new Blob([html], {
      type: 'text/plain',
    });
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedLink.bind(this);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}

/**
 * Deletes current document


function _deleteDocument(storageRelativePath) {
    WrioActions.busy(true);
    deleteFromS3(storageRelativePath).then((res)=>{
        WrioActions.busy(false);
        this.setState({
            error: false
        });
        parent.postMessage(JSON.stringify({
            "followLink": `https://wr.io/${WrioStore.getWrioID()}/Plus-WRIO-App/index.html`
        }), "*");
    }).catch((err)=>{
        WrioActions.busy(false);
        this.setState({
            error: true
        });
        console.log(err);
    });
}
 */
