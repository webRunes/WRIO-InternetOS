import { connect } from 'react-redux';
import ListEditor from '../components/ListEditor';
import * as listActions from '../actions/listEditorActions';

function mapStateToProps(state) {
  return {
    items: state.listEditor,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAddElement: () => {
      dispatch(listActions.addElement({ url: '' }));
    },
    onListChange: key => (elname, data) => {
      console.log(key, data);
      dispatch(listActions.changeElement({ [elname]: data }, key));
      if (elname === 'url') {
        // TODO make smart preview
        // dispatch(listActions.fetchPreview(data, key));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListEditor);
