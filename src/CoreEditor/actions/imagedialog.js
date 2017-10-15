import request from "superagent";
/* image dialog */

export const IMAGE_DIALOG_OPEN = "IMAGE_DIALOG_OPEN";
export const IMAGE_DIALOG_CLOSE = "IMAGE_DIALOG_CLOSE";
export const IMAGE_DIALOG_TITLE_CHANGE = "IMAGE_DIALOG_TITLE_CHANGE";
export const IMAGE_DIALOG_DESC_CHANGE = "IMAGE_DIALOG_DESC_CHANGE";
export const IMAGE_DIALOG_URL_CHANGE = "IMAGE_DIALOG_URL_CHANGE";
export const REQUEST_PREVIEW = "REQUEST_PREVIEW";

export const PREVIEW_BUSY = "PREVIEW_BUSY";

export function openImageDialog(
  titleValue,
  urlValue,
  descValue,
  linkEntityKey = null
) {
  return {
    type: IMAGE_DIALOG_OPEN,
    titleValue,
    urlValue,
    descValue,
    linkEntityKey
  };
}

export function closeDialog() {
  return {
    type: IMAGE_DIALOG_CLOSE
  };
}

export function previewBusy(busy) {
  return {
    type: PREVIEW_BUSY,
    busy
  };
}

export const titleChange = titleValue => ({
  type: IMAGE_DIALOG_TITLE_CHANGE,
  titleValue
});
export const urlChange = urlValue => {
  return dispatch => {
    dispatch({ type: IMAGE_DIALOG_URL_CHANGE, urlValue });
    checkTimeout()
      .then(() => {
        dispatch(previewBusy(true));
        return downloadEmebed(urlValue);
      })
      .then(parsedData => {
        dispatch(descChange(parsedData.description));
        dispatch(titleChange(parsedData.title));
        dispatch(previewBusy(false));
      })
      .catch(err => {
        dispatch(previewBusy(false));
        console.log(err);
      });
  };
};
export const descChange = descValue => ({
  type: IMAGE_DIALOG_DESC_CHANGE,
  descValue
});

const IFRAMELY_LIMIT = 5000; // limit period between iframely requests to 5s

const currentTime = () => new Date().getTime();
const isHitTimeout = () => currentTime() - last_time < IFRAMELY_LIMIT;
let last_time = 0;
let activeTimeout = false;
const checkTimeout = () =>
  new Promise((resolve, reject) => {
    if (activeTimeout) {
      reject("too often");
    }
    if (isHitTimeout()) {
      activeTimeout = true;
      setTimeout(() => {
        activeTimeout = false;
        resolve();
      }, IFRAMELY_LIMIT);
    } else {
      resolve();
    }
    last_time = currentTime();
  });

async function downloadEmebed(url) {
  const res = await request.get(
    "https://iframely.wrioos.com/iframely?url=" + encodeURIComponent(url)
  );
  return res.body.meta;
}
