import React, {Component} from 'react';
import {applyMentions} from '../mixins/mentions';
import CoreEditor from './CoreEditor.js';
import {ContentBlock, CharacterMetadata} from 'draft-js';

import {parseEditingUrl, extractFileName, parseUrl, appendIndex} from '../utils/url.js';
import WrioStore from '../stores/wrio.js';

var domain = process.env.DOMAIN;

class Loading extends Component {
    render () {
        return (<div>
            Loading editor <img src="https://default.wrioos.com/img/loading.gif" id="loadingInd"/>
        </div>);
    }
}

class LoadingError extends Component {
    render () {
        return (<div className="alert alert-danger">
            Oops, something went wrong... Please try again
        </div>);
    }
}


import {fetchDocument,createNewDocument,fetchUserData} from '../actions/index.js'
const [editUrl, saveRelativePath] = parseEditingUrl();
function formatAuthor(id) {
    return id ? `https://wr.io/${id}/?wr.io=${id}` : 'unknown';
}

import {openLinkDialog} from '../actions/linkdialog'
import {openImageDialog} from '../actions/imagedialog'
import EntityTools from '../utils/entitytools'

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
                                                 doc={this.props.document}
                                                 dispatch={this.props.dispatch}
                                                 saveRelativePath={saveRelativePath}
                                                 editUrl={editUrl}
                                                 author={formatAuthor(this.props.wrioID)}/> :
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