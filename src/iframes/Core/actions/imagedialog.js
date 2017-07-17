
/* image dialog */

export const IMAGE_DIALOG_OPEN = 'IMAGE_DIALOG_OPEN';
export const IMAGE_DIALOG_CLOSE = 'IMAGE_DIALOG_CLOSE';
export const IMAGE_DIALOG_TITLE_CHANGE = 'IMAGE_DIALOG_TITLE_CHANGE';
export const IMAGE_DIALOG_DESC_CHANGE = 'IMAGE_DIALOG_DESC_CHANGE';
export const IMAGE_DIALOG_URL_CHANGE = 'IMAGE_DIALOG_URL_CHANGE';
export const REQUEST_PREVIEW = 'REQUEST_PREVIEW';

export function openImageDialog(titleValue, urlValue, descValue,linkEntityKey=null) {
    return {
        type: IMAGE_DIALOG_OPEN,
        titleValue,
        urlValue,
        descValue,
        linkEntityKey
    }
}

export function closeDialog() {
    return {
        type: IMAGE_DIALOG_CLOSE
    }
}

export const titleChange = (titleValue) => ({type:IMAGE_DIALOG_TITLE_CHANGE,titleValue});
export const urlChange = (urlValue) => ({type:IMAGE_DIALOG_URL_CHANGE,urlValue});
export const descChange = (descValue) => ({type:IMAGE_DIALOG_DESC_CHANGE,descValue});


const IFRAMELY_LIMIT = 5000; // limit period between iframely requests to 5s

const currentTime = () => new Date().getTime();
const isHitTimeout = () => (currentTime() - last_time) < IFRAMELY_LIMIT;
let last_time = 0;
let activeTimeout = false;
const checkTimeout = () => new Promise((resolve,reject) => {
    if (activeTimeout) {
        reject("too often");
    }
    if (isHitTimeout()) {
        activeTimeout = true;
        setTimeout(()=>{
            activeTimeout = false;
            resolve();
        },IFRAMELY_LIMIT);
    } else {
        resolve();
    }
    last_time = currentTime();
});


function onRequestIframelyPreview(url) {
    checkTimeout().then(()=>{
        return this.downloadEmebed(url);
    }).then((parsedData)=>{
        this.onDescChange(parsedData.description);
        this.onTitleChange(parsedData.title);
    }).catch((err)=> {
        console.log(err);
    });
}

function _previewBusy(busy) {
    this.state.previewBusy = busy;
    this.trigger(this.state);
}

function downloadEmebed(url) {
    this._previewBusy(true);
    return new Promise((resolve, reject) => {
        request.get('https://iframely.wrioos.com/iframely?url=' + encodeURIComponent(url), (err, result) => {
            if (err) {
                this._previewBusy(false);
                return reject(err);
            }
            this._previewBusy(false);
            resolve(result.body.meta);
        });
    });
}