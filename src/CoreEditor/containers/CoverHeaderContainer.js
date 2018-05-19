import { connect } from 'react-redux';
import CoverHeader from '../components/CoverHeader';
import * as coverDialogActions from 'CoreEditor/actions/coverDialog';

function mapStateToProps(state) {
  return {
    coverDialog: state.coverDialog
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCoverPressed: () => dispatch(coverDialogActions.openCoverDialog())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverHeader);
