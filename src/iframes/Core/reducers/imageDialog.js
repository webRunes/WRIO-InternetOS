/**
 * Created by michbil on 16.07.17.
 */

import { combineReducers } from 'redux'
import {
    IMAGE_DIALOG_DESC_CHANGE,
    IMAGE_DIALOG_TITLE_CHANGE,
    IMAGE_DIALOG_URL_CHANGE,
    IMAGE_DIALOG_OPEN,
    IMAGE_DIALOG_CLOSE
} from '../actions/imagedialog'



const defaultState =  {
    titleValue: '',
    urlValue: '',
    descValue: '',
    showDialog: false,
    previewBusy: false,
};

export function imageDialogReducer(state = defaultState, action) {
    const {titleValue, urlValue, descValue, linkEntityKey} = action;
    switch (action.type) {
        case IMAGE_DIALOG_OPEN:
            return {...state,
                showDialog: true,
                titleValue,
                urlValue,
                descValue,
                linkEntityKey};

        case IMAGE_DIALOG_CLOSE:
            return {...state,showDialog:false};
        case IMAGE_DIALOG_DESC_CHANGE:
            return {...state,descValue};
        case IMAGE_DIALOG_TITLE_CHANGE:
            return {...state,titleValue};
        case IMAGE_DIALOG_URL_CHANGE:
            return {...state,urlValue};

        default:
            return state
    }
}


export default imageDialogReducer;
