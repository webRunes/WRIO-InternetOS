import { connect } from 'react-redux';
import CoverHeader from 'base/components/CoverHeader';
import * as actions from 'base/actions/actions';
import * as coverActions from 'CoreEditor/actions/coverActions';
import * as coverDialogActions from 'CoreEditor/actions/coverDialog';

function mapStateToProps(state) {
  return {
    covers: state.header.covers,
    images: state.header.images,
    currentCover: state.header.selected,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCoverChanged: (current) => {
      dispatch(actions.selectCover(current));
    },
    onCoverPressed: (cover) => {
      console.log('Cover clicked!!!', cover);
      dispatch(coverDialogActions.openCoverDialog(cover));
    },
    onCoverButtonPressed: cover => dispatch(actions.pressCoverButton(cover)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverHeader);
