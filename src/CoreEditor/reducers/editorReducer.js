


const defaultState = {
    document: null,
    header: "",
};

 const edtorDocumentReducer (editorName) => (state = defaultState, action) =>  {
    console.log("got action", action);
    const applyName = (name) => `${name}_${editorName}` 
    switch (action.type) {
        case applyName(CREATE_DOCUMENT):
            const newDoc = new JSONDocument();
            newDoc.createArticle(action.author, "");
            return mkDoc(state,newDoc);
        case applyName(REQUEST_DOCUMENT):
            return {...state,isFetching:true};
        case applyName(GOT_ERROR):
            return {...state,isFetching: false,error: action.error};
        case applyName(GOT_JSON_LD_DOCUMENT):
            const doc =  action.data;
            return mkDoc(state,doc);
        case applyName(EDITOR_CHANGED):
            const editorState = action.editorState;
            const header = JSONDocument.getTitle(editorState.getCurrentContent());
            return extractHeader({...state,editorState: editorState});
        case applyName(CREATE_NEW_IMAGE):
            return {...state, editorState: createNewImage(state.editorState,action.url,action.desc,action.title)};
        case applyName(CREATE_NEW_LINK):
            return {...state, editorState: createNewLink(state.editorState,action.url,action.desc,action.title)};
        case applyName(REMOVE_ENTITY):
            return {...state, editorState: removeEntity(state.editorState,action.key)};
        default:
            return state
    }
}

export default editorReducer;