const defaultState = {
  document: null,
  header: '',
};

const edtorDocumentReducer = editorName => (state = defaultState, action) => {
  console.log('got action', action);
  const applyName = name => `${name}_${editorName}`;
  switch (applyName(action.type)) {
    case CREATE_DOCUMENT:
      const newDoc = new JSONDocument();
      newDoc.createArticle(action.author, '');
      return mkDoc(state, newDoc);
    case REQUEST_DOCUMENT:
      return { ...state, isFetching: true };
    case GOT_ERROR:
      return { ...state, isFetching: false, error: action.error };
    case GOT_JSON_LD_DOCUMENT:
      const doc = action.data;
      return mkDoc(state, doc);
    case EDITOR_CHANGED:
      const editorState = action.editorState;
      const header = JSONDocument.getTitle(editorState.getCurrentContent());
      return extractHeader({ ...state, editorState });
    case CREATE_NEW_IMAGE:
      return {
        ...state,
        editorState: createNewImage(state.editorState, action.url, action.desc, action.title),
      };
    case CREATE_NEW_LINK:
      return {
        ...state,
        editorState: createNewLink(state.editorState, action.url, action.desc, action.title),
      };
    case EMOVE_ENTITY:
      return { ...state, editorState: removeEntity(state.editorState, action.key) };
    default:
      return state;
  }
};

export default editorReducer;
