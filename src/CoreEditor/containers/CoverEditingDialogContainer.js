import React from 'react';
import { connect } from 'react-redux';
import { closeCoverDialog } from '../actions/coverDialog';
import CoverEditingDialog from '../components/CoverEditingDialog';

import mkEditorActions from '../actions/indexActions';
import { saveCovers } from '../actions/coverDialog';
import { openImageDialog } from '../actions/imagedialog';
import { openLinkDialog } from '../actions/linkdialog';

function mapStateToProps(state) {
  const { showDialog } = state.coverDialog;
  return {
    showDialog,
    imageUrl: state.coverDialog.imageUrl,
    editorState: state.coverDialog.subEdtior.editorState,
  };
}

// dispatch according actions

const { editorChanged } = mkEditorActions('COVEREDITOR_'); // map action name to particular editor name

const mapDispatchToProps = dispatch => ({
  imageUrlChange: url => dispatch({ type: 'COVER_DIALOG_IMAGE_URL_CHANGED', url }),
  onCloseDialog: () => {
    dispatch(closeCoverDialog());
  },
  onSaveCover: (editorState, imageUrl) => dispatch(saveCovers(editorState, imageUrl)),
  openLinkDialog: (...args) => dispatch(openLinkDialog(...args)),
  openImageDialog: (...args) => dispatch(openImageDialog(...args)),
  editorChanged: state => dispatch(editorChanged(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CoverEditingDialog);
