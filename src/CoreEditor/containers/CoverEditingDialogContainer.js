import React from 'react';
import { connect } from 'react-redux';
import {
  closeCoverDialog,
  newCover,
  coverTabChange,
  coverTabDelete,
  coverDialogImageUrlChanged
} from '../actions/coverDialog';
import {
  editorChanged
} from '../actions/coverActions';
import CoverEditingDialog from '../components/CoverEditingDialog';

import mkEditorActions from '../actions/indexActions';
import { saveCovers } from '../actions/coverDialog';
import { openImageDialog } from '../actions/imagedialog';
import { openLinkDialog } from '../actions/linkdialog';

function mapStateToProps(state) {
  const { showDialog } = state.coverDialog;
  return {
    showDialog,
    imageUrl: state.coverDialog.tab.imageUrl,
    tabs: state.coverDialog.tabs,
    tab: state.coverDialog.tab,
  };
}

// dispatch according actions

const mapDispatchToProps = (dispatch, getState) => {
  return {
    imageUrlChange: url => dispatch(coverDialogImageUrlChanged(url)),
    onCloseDialog: () => dispatch(closeCoverDialog()),
    onSaveCover: (editorState, imageUrl) => dispatch(saveCovers(editorState, imageUrl)),
    openLinkDialog: (...args) => dispatch(openLinkDialog(...args)),
    openImageDialog: (...args) => dispatch(openImageDialog(...args)),
    editorChanged: state => dispatch(editorChanged(state)),
    onCoverTabChange: (...args) => dispatch(coverTabChange(...args)),
    onCoverTabDelete: activeTabKey => dispatch(coverTabDelete(activeTabKey)),
    onNewCover: () => dispatch(newCover()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CoverEditingDialog);
