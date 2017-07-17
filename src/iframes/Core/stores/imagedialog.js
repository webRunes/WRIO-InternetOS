/**
 * Created by michbil on 07.12.16.
 */
import Reflux from 'reflux';
import LinkActions from '../actions/imagedialog.js';
import TextEditorActions from '../actions/texteditor.js';
import request from 'superagent';



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



});