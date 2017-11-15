import React from 'react';
import { titleChange, descChange, urlChange, closeDialog } from '../actions/linkdialog';
import EntityDialog from '../components/EntityDialog';
import mkActions from '../actions/indexActions';
import { connect } from 'react-redux';

const { createNewLink, editLink, removeEntity } = mkActions('MAIN');

function mapStateToProps(state) {
  const {
    showDialog, titleValue, urlValue, descValue, linkEntityKey,
  } = state.linkDialog;
  return {
    showDialog,
    titleValue,
    urlValue,
    descValue,
    linkEntityKey,
    showTitle: false, // customize settings
    showDescription: false, // customize settings
    isEditLink: true,
  };
}

// dispatch according actions

const mapDispatchToProps = dispatch => ({
  onTitleChange: v => dispatch(titleChange(v)),
  onDescChange: v => dispatch(descChange(v)),
  onUrlChange: v => dispatch(urlChange(v)),

  onRemoveLink: (key) => {
    dispatch(removeEntity(key));
    dispatch(closeDialog());
  },
  onCancelLink: () => dispatch(closeDialog()),
  onConfirmLink: (titleValue, urlValue, descValue) => {
    dispatch(createNewLink(titleValue, urlValue, descValue));
    dispatch(closeDialog());
  },
  onEditLink: (titleValue, urlValue, descValue, linkEntityKey) => {
    dispatch(editLink(titleValue, urlValue, descValue, linkEntityKey));
    dispatch(closeDialog());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EntityDialog);
