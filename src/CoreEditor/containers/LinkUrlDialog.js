import React from 'react';
import { submitDialog, closeDialog } from '../actions/linkdialog';
import EntityDialog from '../components/EntityDialog';
import mkActions from '../actions/indexActions';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

const { createNewLink, editLink, removeEntity } = mkActions('MAIN');

function mapStateToProps(state) {
  const {
    showDialog, linkEntityKey, urlValue, titleValue, descValue,
  } = state.linkDialog;
  return {
    showDialog,
    linkEntityKey,
    showTitle: false, // customize settings
    showDescription: false, // customize settings
    isEditLink: true,
    initialValues: {
      url: urlValue,
    },
  };
}

// dispatch according actions

const mapDispatchToProps = dispatch => ({
  onRemoveLink: (key) => {
    dispatch(removeEntity(key));
    dispatch(closeDialog());
  },
  onCancelLink: () => dispatch(closeDialog()),
  onSubmit: (values) => {
    dispatch(submitDialog(values));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  // a unique name for the form
  form: 'linkDialog',
  enableReinitialize: true,
})(EntityDialog));
