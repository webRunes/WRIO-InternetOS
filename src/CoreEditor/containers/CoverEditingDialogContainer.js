import React from "react";
import {
  titleChange,
  descChange,
  urlChange,
  closeDialog
} from "../actions/coverDialog";

import CoverEditingDialog from "../components/CoverEditingDialog";

import { connect } from "react-redux";

function mapStateToProps(state) {
  let { showDialog } = state.coverDialog;
  return { showDialog };
}

// dispatch according actions

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CoverEditingDialog);
