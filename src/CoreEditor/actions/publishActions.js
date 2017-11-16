// @flow
import { Entity } from 'draft-js';
import { saveToS3, getWidgetID } from '../webrunesAPI.js';
import { formatAuthor } from '../utils/url.js';
import DraftExporter from '../DraftExporter';

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

/**
 * Publish logic
 * requests commentID from the server, if not supplied
 */
export function publishDocument(saveSource: string) {
  return async (dispatch: Function, getState: Function) => {
    dispatch({ type: PUBLISH_DOCUMENT });
    try {
      const state: Object = getState();
      const { document, editorState } = state.editorDocument;
      const exporter = new DraftExporter(document);
      let commentId: string = document.getCommentID();
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
      if (commentsEnabled && commentId === '') {
        commentId = (await getWidgetID(saveUrl)).text;
        console.log('Get widget id succeded', commentId);
      }
      if (!commentsEnabled) {
        commentId = '';
      }
      document.setCommentID(commentId);
      document.setAbout(description);

      const html = exporter.articleDraftToHtml(
        editorState.getCurrentContent(),
        formatAuthor(wrioID),
        commentId,
        coverHtml ? coverSavePath : undefined,
      );
      if (saveSource === 'S3') {
        const saveRes = await saveToS3(savePath, html);
        console.log('SAVER RESULT', saveRes.body);
        if (coverHtml) {
          const coverSaveRes = await saveToS3(coverFileName, coverHtml);
          console.log('COVER SAVE RESULT', coverSaveRes.body);
        }

        window.location = saveUrl;
      } else {
        const name = document.getProperty('name');
        const fileName = `${name === '' ? 'untitled' : name.split(' ').join('_')}.html`;
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

export function publishCover(html) {
  return async (dispatch: Function, getState: Function) => {
    dispatch({ type: PUBLISH_COVER, html });
    //    const state = getState();
    //  const { savePath } = state.publish;

    // const saveRes = await saveToS3(savePath, html);

    // dispatch({ type: PUBLISH_FINISH, savePath });
    //    } catch (err) {
    //      console.error('Caught error during publish', err);
    //      dispatch({ type: 'GOT_ERROR' });
    //    }
  };
}

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
