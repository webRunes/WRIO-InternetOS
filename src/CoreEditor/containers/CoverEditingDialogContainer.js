import React from 'react';
import { closeCoverDialog } from '../actions/coverDialog';

import CoverEditingDialog from '../components/CoverEditingDialog';

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { showDialog } = state.coverDialog;
  return { showDialog };
}

// dispatch according actions

const mapDispatchToProps = dispatch => ({
  onCloseDialog: () => {
    dispatch(closeCoverDialog());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CoverEditingDialog);
