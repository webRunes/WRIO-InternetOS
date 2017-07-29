import React, {Component} from 'react';
import {applyMentions} from '../mixins/mentions';
import CoreEditor from './CoreEditor.js';
import {ContentBlock, CharacterMetadata} from 'draft-js';

import {openLinkDialog} from '../actions/linkdialog'
import {openImageDialog} from '../actions/imagedialog'
import EntityTools from '../utils/entitytools'
import {Loading, LoadingError} from '../components/loading'
import {fetchDocument,createNewDocument,fetchUserData} from '../actions/indexActions.js'
import {gotUrlParams} from '../actions/publishActions.js'

import {parseEditingUrl} from '../utils/url.js';
const CREATE_MODE = window.location.pathname === "/create";
const [EDIT_URL, EDIT_RELATIVE_PATH] = parseEditingUrl();

function initCallbacks(dispatch) {
    const openEditPrompt = (action) =>  (titleValue, urlValue, descValue, linkEntityKey) => {
        const actn = action(titleValue,urlValue,descValue,linkEntityKey);
        dispatch(actn);
    };

    EntityTools.setLinkEditCallback(openEditPrompt(openLinkDialog));
    EntityTools.setImageEditCallback(openEditPrompt(openImageDialog));
}


class AsyncApp extends React.Component {
    componentDidMount() {
        const dispatch = this.props.dispatch;
        dispatch(gotUrlParams(CREATE_MODE,EDIT_URL,EDIT_RELATIVE_PATH)); // pass initial editing params to the store
        initCallbacks(this.props.dispatch);
        if (window.location.pathname === "/create") {
            dispatch(createNewDocument())
        } else {
            dispatch(fetchDocument(editUrl));
        }
        dispatch(fetchUserData())
        document.getElementById("loadingInd").setAttribute('style','display:none;');

    }
    componentDidUpdate(prevProps) {
        frameReady();
    }

    render () {
        return (
            <div className="clearfix">
                {this.props.error ? <LoadingError /> : ""}
                {!this.props.isFetching ? <CoreEditor
                                                 editorState={this.props.editorState}
                                                 dispatch={this.props.dispatch}
                                                 /> :
                    <Loading /> }

            </div>
        );
    }
}

import { connect } from 'react-redux'

function mapStateToProps(state) {


    return {
        document: state.document.document,
        editorState: state.document.editorState,
        isFetching: state.document.isFetching,
        error: state.document.error
    }
}

export default connect(mapStateToProps)(AsyncApp)