/**
 * Created by michbil on 07.08.16.
 */
import Reflux from 'reflux';
import TextActions from '../actions/texteditor.js';
import {AtomicBlockUtils, CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata, getDefaultKeyBinding, Modifier,convertToRaw} from 'draft-js';
import JSONDocument from '../JSONDocument.js';
import WrioActions from '../actions/wrio.js';
import EntityTools,{getSelection,findLinkEntities,findImageEntities,findSocialEntities} from '../utils/entitytools.js';




export default Reflux.createStore({
    listenables:TextActions,

    init() {
        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.oldHeader = "";
    },


    getSelectedText() {
        const { editorState } = this.state;
        return getSelection(editorState);
    },

    onUpdateEditorState(state) {
        this.state.editorState = state;
        const header = JSONDocument.getTitle(state.getCurrentContent());
        if (header != this.oldHeader) {
            WrioActions.headerChanged(header);
        }
        this.oldHeader = header;
    },

    onPublishEditorState(state) {
        this.state.editorState = state;
        this.trigger(this.state);
    },



});