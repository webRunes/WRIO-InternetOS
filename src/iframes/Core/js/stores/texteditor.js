/**
 * Created by michbil on 07.08.16.
 */
import Reflux from 'reflux';
import TextActions from '../actions/texteditor.js';
import {AtomicBlockUtils, CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata, getDefaultKeyBinding,  Modifier} from 'draft-js';
import LinkEntity from '../EditorEntities/LinkEntity.js';
import ImageEntity from '../EditorEntities/ImageEntitiy.js';
import SocialMediaEntity from '../EditorEntities/SocialMediaEntity.js';
import JSONDocument from '../JSONDocument.js';
import WrioActions from '../actions/wrio.js';
import EntityTools,{getSelection,findLinkEntities,findImageEntities,findSocialEntities} from '../utils/entitytools.js';


function appendHttp(url) {
    if (!/^https?:\/\//i.test(url)) {
        return 'http://' + url;
    }
    return url;
}


export default Reflux.createStore({
    listenables:TextActions,

    init() {
        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.oldHeader = "";
    },

    setLinkEditCallback(cb) {
        EntityTools.setLinkEditCallback(cb);
    },
    setImageEditCallback(cb) {
        EntityTools.setImageEditCallback(cb);
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

    createEditorState(metaBlocks, mentions, images) {
        const decorator = new CompositeDecorator([{
            strategy: findLinkEntities,
            component: LinkEntity
        },{
            strategy: findImageEntities,
            component: ImageEntity
        },
        {
            strategy: findSocialEntities,
            component: SocialMediaEntity
        }
        ]);

        const valuesToKeys = (hash,value)=>{
            let key = value['order']+1;
            hash[key] = value['block'];
            return hash;
        };
        const orderedBlocks = metaBlocks.reduce(valuesToKeys,{});

        //console.log(orderedBlocks);
        const contentBlocks = metaBlocks.map(x => x.block);

        let editorState = contentBlocks.length > 0 ?
            EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks), decorator) :
            EditorState.createEmpty(decorator);

        editorState = metaBlocks.reduce((editorState,metaBlock) => metaBlock.data ? EntityTools.constructSocial(editorState,metaBlock) : editorState, editorState);
        if (images) {
            editorState = images.reduce((editorState,mention) => EntityTools.constructImage(editorState,orderedBlocks,mention),editorState);
        }

        return mentions.reduce((editorState,mention) => EntityTools.constructMention(editorState,orderedBlocks,mention),editorState);

    },

    onCreateNewLink(titleValue,urlValue,descValue) {

        urlValue = appendHttp(urlValue);

        const entityKey = EntityTools.createLinkEntity(titleValue,urlValue,descValue);
        const {editorState} = this.state;

        const e = Entity.get(entityKey).getData();
        console.log(e);

        let _editorState = RichUtils.toggleLink(
            editorState,
            editorState.getSelection(),
            entityKey
        );
        this.onPublishEditorState(_editorState);
    },

    onCreateNewImage (url,description,title) {
        const entityKey = EntityTools.createImageSocialEntity(url,description,title);
        const {editorState} = this.state;
        this.onPublishEditorState(EntityTools.insertEntityKey(editorState,entityKey));
    },

    onEditLink(titleValue,urlValue,descValue,linkEntityKey) {
        Entity.mergeData(linkEntityKey, {
            linkTitle: titleValue,
            linkUrl: urlValue,
            linkDesc: descValue
        });
        editorFocus();
      //  this.onPublishEditorState(EditorState.moveFocusToEnd(this.state.editorState));
    },

    onEditImage(src,description,title,linkEntityKey) {
        Entity.mergeData(linkEntityKey, {
            src,
            title,
            description
        });
        editorFocus();
       // this.onPublishEditorState(EditorState.moveFocusToEnd(this.state.editorState));
    },

    onRemoveEntity(entityKeyToRemove) {
        const {editorState} = this.state;

        editorState.getCurrentContent().getBlockMap().map(block => {
            block.findEntityRanges(char => {
                let entityKey = char.getEntity();
                return !!entityKey && entityKey === entityKeyToRemove;
            }, (anchorOffset, focusOffset) => {
                let _editorState = RichUtils.toggleLink(
                    editorState,
                    SelectionState.createEmpty(block.getKey()).merge({
                        anchorOffset,
                        focusKey: block.getKey(),
                        focusOffset
                    }),
                    null
                );
                this.onPublishEditorState(_editorState);
            });
        });
    }


});