/**
 * Created by michbil on 07.12.16.
 */
import Reflux from 'reflux';
import LinkActions from '../actions/imagedialog.js';
import TextEditorActions from '../actions/texteditor.js';
import request from 'superagent';

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

export default Reflux.createStore({
    listenables: LinkActions,
    init() {
        this.state = {
            showURLInput: false
        };
    },

    getInitialState: function() {
        return {
            titleValue: '',
            urlValue: '',
            descValue: '',
            showURLInput: false,
            isEditLink: false,
            previewBusy: false,
        };

    },

    onOpenToCreate(titleValue, urlValue, descValue) {
        this.state = {
            showURLInput: true,
            isEditLink: false,
            titleValue,
            urlValue,
            descValue
        };
        this.trigger(this.state);
    },

    onOpenToEdit(titleValue, urlValue, descValue,linkEntityKey) {
        this.state = {
            showURLInput: true,
            isEditLink: true,
            titleValue,
            urlValue,
            descValue,
            linkEntityKey
        };
        this.trigger(this.state);
    },

    onCloseDialog() {
        this.state.showURLInput = false;
        this.trigger(this.state);
        TextEditorActions.focus();
    },

    onTitleChange(val) {
        this.state.titleValue = val;
        this.trigger(this.state);
    },

    onDescChange(val) {
        this.state.descValue = val;
        this.trigger(this.state);
    },

    onUrlChange(val) {
        this.state.urlValue = val;
        this.trigger(this.state);
        this.onRequestIframelyPreview(val);
    },

    onRequestIframelyPreview(url) {
        checkTimeout().then(()=>{
            return this.downloadEmebed(url);
        }).then((parsedData)=>{
               this.onDescChange(parsedData.description);
               this.onTitleChange(parsedData.title);
        }).catch((err)=> {
              console.log(err);
        });
    },

    _previewBusy(busy) {
        this.state.previewBusy = busy;
        this.trigger(this.state);
    },

    downloadEmebed(url) {
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

});