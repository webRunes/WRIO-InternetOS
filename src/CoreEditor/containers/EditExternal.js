import { connect } from 'react-redux';
import EditExternal from '../components/EditExternal';
import * as externalActions from 'CoreEditor/actions/externalsEditor';
import * as actions from 'base/actions/actions';

function mapStateToProps(state) {
  return {
    externals: state.externalsEditor,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (index, e) => {
      const url = e.target.value;
      dispatch(externalActions.externalChanged(index, url));
      dispatch(actions.loadExternal(index, url));
    },
    onAddElement: () => {
      dispatch({ type: 'EXTERNAL_ADD' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditExternal);
