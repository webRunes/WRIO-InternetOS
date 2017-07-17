import React from 'react';
import Modal from 'react-modal';
import TextEditorActions from '../actions/texteditor.js';
import {
   titleChange,
    descChange,
    urlChange,
    closeDialog
} from '../actions/linkdialog'

import {createNewLink,editLink,removeEntity} from '../actions/index'
import EntityDialog from '../components/EntityDialog'

/*
    onEditLink(e) {
        const {titleValue, urlValue, descValue, linkEntityKey} = this.props;
        TextEditorActions.editLink(titleValue, urlValue, descValue, linkEntityKey);
        this.props.dispatch(closeDialog());
    }

    onConfirmLink(e) {
        const {titleValue, urlValue, descValue} = this.props;
        TextEditorActions.createNewLink(titleValue, urlValue, descValue);
        this.props.actions.closeDialog();
    }

    onCancelLink(e) {
        this.props.dispatch(closeDialog());

    }

    onRemoveLink(e) {
        e.preventDefault();
        const {linkEntityKey} = this.props;
        TextEditorActions.removeEntity(linkEntityKey);
        this.props.dispatch(closeDialog());
    }
*/


import { connect } from 'react-redux'

function mapStateToProps(state) {
    let { showDialog, isEditLink, titleValue, urlValue, descValue, linkEntityKey} = state.linkDialog;
    return { showDialog,
        titleValue,
        urlValue,
        descValue,
        linkEntityKey,
        showTitle:false, // customize settings
        showDescription:false, // customize settings
        isEditLink: true
    }
}

// dispatch according actions

const mapDispatchToProps = dispatch => {
    return {
        onTitleChange : (v) => dispatch(titleChange(v)),
        onDescChange : (v) => dispatch(descChange(v)),
        onUrlChange : (v) => dispatch(urlChange(v)),

        onRemoveLink : (key) => {
            dispatch(removeEntity(key));
            dispatch(closeDialog());
        },
        onCancelLink : () => dispatch(closeDialog()),
        onConfirmLink: (titleValue, urlValue, descValue) => {
            dispatch(createNewLink(titleValue, urlValue, descValue));
            dispatch(closeDialog())
        },
        onEditLink: (titleValue, urlValue, descValue,linkEntityKey) => {
            dispatch(editLink(titleValue, urlValue, descValue,linkEntityKey));
            dispatch(closeDialog());
        },
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(EntityDialog)
