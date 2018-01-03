import { createSelector } from 'reselect';

const getWrioID = state => state.publish.wrioID;
const getCreateMode = state => state.publish.editParams.createMode;

/**
 * Helper function, calculates resulting path when header of the page changed
 * @param state
 * @param filename
 * @returns {{savePath, saveUrl}}
 */
function calcResultingPath(state, filename) {
  const path = prepFileName(filename);
  const coverFileName = prepCoverName(filename);
  const { createMode, initEditPath, initEditURL } = state.editParams;
  return {
    ...state,
    filename,
    coverFileName,
    coverSavePath: `${getSaveUrl(state.wrioID, coverFileName)}?cover`,
    savePath: createMode ? path : initEditPath, // fallback to predefined path if we just editing file
    saveUrl: createMode ? getSaveUrl(state.wrioID, path) : initEditURL,
  };
}

export const getSaveUrl = (wrioID, path) => `https://wr.io/${wrioID}/${path}`;

function prepFileName(name) {
  const res = name.replace(/ /g, '_');
  return `${res.substring(0, 120)}/index.html`;
}

function prepCoverName(name) {
  const res = name.replace(/ /g, '_');
  return `${res.substring(0, 120)}/cover/cover.html`;
}
