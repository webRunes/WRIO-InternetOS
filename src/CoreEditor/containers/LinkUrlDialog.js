import React from "react";

import {
  titleChange,
  descChange,
  urlChange,
  closeDialog
} from "../actions/linkdialog";

import { createNewLink, editLink, removeEntity } from "../actions/indexActions";
import EntityDialog from "../components/EntityDialog";

import { connect } from "react-redux";

function mapStateToProps(state) {
  let {
    showDialog,
    isEditLink,
    titleValue,
    urlValue,
    descValue,
    linkEntityKey
  } = state.linkDialog;
  return {
    showDialog,
    titleValue,
    urlValue,
    descValue,
    linkEntityKey,
    showTitle: false, // customize settings
    showDescription: false, // customize settings
    isEditLink: true
  };
}

// dispatch according actions

const mapDispatchToProps = dispatch => {
  return {
    onTitleChange: v => dispatch(titleChange(v)),
    onDescChange: v => dispatch(descChange(v)),
    onUrlChange: v => dispatch(urlChange(v)),

    onRemoveLink: key => {
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityDialog);
