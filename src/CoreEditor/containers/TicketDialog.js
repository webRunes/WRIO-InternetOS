import React from 'react';
import { submitDialog, closeDialog } from '../actions/ticketdialog';
import EntityDialog from '../components/EntityDialog';
import mkActions from '../actions/indexActions';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

const { removeEntity } = mkActions('MAIN');

function mapStateToProps(state) {
  const {
    showDialog,
    linkEntityKey,
    previewBusy,
    urlValue,
    titleValue,
    descValue,
    image,
  } = state.ticketDialog;
  return {
    showDialog,
    previewBusy,
    linkEntityKey,
    showTitle: true, // customize settings
    showDescription: true, // customize settings
    showImage: true,
    isEditLink: false,
    initialValues: {
      url: urlValue,
      title: titleValue,
      description: descValue,
      image,
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
  onSubmit: values => dispatch(submitDialog(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  // a unique name for the form
  form: 'ticketDialog',
  enableReinitialize: true,
})(EntityDialog));
