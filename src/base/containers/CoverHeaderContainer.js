import { connect } from "react-redux";
import CoverHeader from "base/components/CoverHeader";
import * as actions from "../actions/actions";

function mapStateToProps(state) {
  return {
    covers: state.header.covers,
    images: state.header.images,
    currentCover: state.header.selected
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCoverChanged: current => {
      dispatch(actions.selectCover(current));
    },
    onCoverButtonPressed: cover => dispatch(actions.pressCoverButton(cover))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverHeader);
