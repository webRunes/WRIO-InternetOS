import React from 'react';
import Reflux from 'reflux';
import {CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata, getDefaultKeyBinding,  Modifier, convertToRaw} from 'draft-js';
import TextEditorStore from './stores/texteditor.js';
import TextEditorActions from './actions/texteditor.js';
import LinkDialogActions from './actions/linkdialog.js';
import LinkDialogStore from './stores/linkDialog.js';
import ImageDialogActions from './actions/imagedialog.js';
import ImageDialogStore from './stores/imagedialog.js';

import SaveActions from './saveActions';
import {deleteFromS3} from './webrunesAPI.js';

import Alert from './components/Alert.js';
import StyleButton from './components/StyleButton.js';
import LinkUrlDialog from './components/LinkUrlDialog.js';
import ImageUrlDialog from './components/ImageUrlDialog.js';
import PostSettings from './components/Postsettings.js';
import WrioStore from './stores/wrio.js';
import WrioActions from './actions/wrio.js';


const openEditPrompt = (actions) => (titleValue, urlValue, descValue, linkEntityKey) => {
    actions.openToEdit(titleValue,urlValue,descValue,linkEntityKey);
};
const openLinkEditPrompt = openEditPrompt(LinkDialogActions);
const openImageEditPrompt = openEditPrompt(ImageDialogActions);

class CoreEditor extends React.Component {
    constructor(props) {
        super(props);
        var contentBlocks,mentions;
        var doc = this.props.doc;
        if (doc) {
            doc.toDraft();
            contentBlocks = doc.contentBlocks;
            mentions = doc.mentions;
        } else {
            contentBlocks = [];
            mentions = [];
        }

        TextEditorStore.setLinkEditCallback(openLinkEditPrompt);
        TextEditorStore.setImageEditCallback(openImageEditPrompt);

        WrioActions.setDoc(doc);

        this.state = {
            editorState:  EditorState.moveFocusToEnd (TextEditorStore.createEditorState(contentBlocks,mentions,doc.images)),
            saveRelativePath: props.saveRelativePath,
            editUrl: props.editUrl,
            author: props.author,
            doc:doc,
            registerPopup: false,
            error:false
        };


        this.handleKeyCommand   = this.handleKeyCommand.bind(this);
        this.toggleBlockType    = this.toggleBlockType.bind(this);
        this.toggleInlineStyle  = this.toggleInlineStyle.bind(this);
        this.onLinkControlClick = this.onLinkControlClick.bind(this);
        this.focus              = this.focus.bind(this);

        TextEditorStore.listen(this.onStatusChange.bind(this));
        setTimeout(this.focus.bind(this),200);
        window.editorFocus = this.onFocus.bind(this);
    }


    onStatusChange(state) { // When s
        this.setState({
            editorState:state.editorState
        });
    }


    handleChange (editorState) {
        console.log(convertToRaw(editorState.getCurrentContent()));
        this.setState({
            editorState:editorState
        });
        console.log("Action");
        TextEditorActions.updateEditorState(editorState);
    }

    focus() {
        this.refs.editor.focus();
    }
    onFocus()
    {
        setTimeout(() => this.focus(), 0);
    }

    onLinkControlClick() {
        var title = TextEditorStore.getSelectedText();
        LinkDialogActions.openToCreate(title,"","");
    }

    onImageControlClick() {
        var title = TextEditorStore.getSelectedText();
        ImageDialogActions.openToCreate(title,"","");
    }


    handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            TextEditorActions.publishEditorState(newState);
            return true;
        }
        return false;
    }

    toggleBlockType(blockType) {
        TextEditorActions.publishEditorState(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    toggleInlineStyle(inlineStyle) {
        TextEditorActions.publishEditorState(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }


    componentDidUpdate () {
        window.frameReady();
    }

    myKeyBindingFn(e) {
      if (e.keyCode === 13) {
        window.frameReady();
      }
      return getDefaultKeyBinding(e);
    }

    render() {
        const {editorState} = this.state;
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        const about = this.state.doc.getElementOfType('Article').about || "";

        if (this.state.registerPopup) {
            return (<div className="well">
                <h4> To enable comments, you need to create ethereum wallet. Please do it in the popup window.</h4>
                <button className="btn btn-success" onClick={()=>this.setState({ registerPopup: false})}> Back </button>
            </div>);
        }

        return (
            <div className="clearfix">
            <div >
                { this.state.error && <Alert type="danger" message="There is an error saving your file, please try again later" /> }

                {false && <div className="well">
                    <h4>You are not logged in</h4>
                    <p>You can still create posts. However, you need to be logged in to save access path to the post and to received donates.</p>
                    <br />
                    <a className="btn btn-sm btn-primary" href="#" role="button"><span
                        className="glyphicon glyphicon-user"></span>Login with Twitter</a>
                </div>}
                <div className="RichEditor-root form-group">
                  <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                    onLinkToggle={this.onLinkControlClick}
                    onImageToggle={this.onImageControlClick}
                  />

                  { false && <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                  />}
                  <LinkUrlDialog actions={LinkDialogActions} store={LinkDialogStore}/>
                  <ImageUrlDialog actions={ImageDialogActions} store={ImageDialogStore}/>
                  <div className={className} onClick={this.focus}>
                    <Editor
                      blockStyleFn={getBlockStyle}
                      editorState={editorState}
                      handleKeyCommand={this.handleKeyCommand}
                      onChange={this.handleChange.bind(this)}
                      placeholder="Enter text..."
                      ref="editor"
                      spellCheck={true}
                      keyBindingFn={this.myKeyBindingFn}
                    />
                  </div>
                </div>
                </div>

            <PostSettings saveUrl={this.state.editUrl}
                          onPublish={this.publish.bind(this)}
                          onDelete={this.deleteDocument.bind(this)}
                          description={about}
                          commentID={this.state.commentID}
                          author={this.props.author}
                    />
            </div>
        );
    }

    componentDidMount() {
        this.listener = WrioStore.listen(this.storeListener.bind(this));
    }

    componentWillUnmount() {
        this.listener();
    }

    storeListener(state) {
        this.setState({commentID: state.commentID});
        this.openCreateWalletPopup();
    }

    shouldOpenPopup() {
        const haveEthId = typeof WrioStore.getUser().ethereumWallet !== "undefined";
        return !haveEthId && WrioStore.areCommentsEnabled();
    }

    openCreateWalletPopup() {
        const domain = process.env.DOMAIN;
        const webGoldUrl = `//webgold.${domain}`;
        if (this.shouldOpenPopup()) {
            window.open(webGoldUrl+'/create_wallet','name','width=800,height=500');
            this.setState({
                registerPopup: true
            });
            this.waitPopupClosed(() => {
               WrioStore.getUser().ethereumWallet="new"; // TODO fix hack
                this.setState({
                    registerPopup: false
                });
            });
        }
    }

    waitPopupClosed(cb) {
        if (!this.shouldOpenPopup()) {
            return cb();
        }
        window.addEventListener("message", (msg) => {
            const data = JSON.parse(msg.data);
            if (data.reload) {
                cb();
            }
        }, false);
    }

    /**
     * Pulish file to store
     * @param action 'save' or 'saveas'
     * @param storageRelativePath relative path to the user's directory
     * @param url - absolute save path, needed for widget url creation
     * @param desc - description of the document
     */
    publish(action,storageRelativePath,url,desc) {
        console.log(storageRelativePath,desc);

        const saveAction = (commentId) => SaveActions.execSave(
            this.state.editorState,
            action,
            storageRelativePath,
            this.state.author,
            commentId,
            this.state.doc,
            desc,
            url
        );

        const doSave = (id) => saveAction(id).then(()=>{
            WrioActions.busy(false);
            this.setState({error: false});
        }).catch((err)=> {
            WrioActions.busy(false);
            this.setState({error: true});
            console.log(err);
        });

        let commentID = this.state.commentID;
        if (this.state.commentID) { // don't request comment id, if it already stored in the document
            if (!WrioStore.areCommentsEnabled()) {
                commentID = ''; // delete comment id if comments not enabled
            }
            doSave(commentID);
        } else {
            WrioActions.busy(true);
            WrioStore.requestCommentId(url,(err,id) => {
                doSave(id);
            });
        }



    }

    /**
     * Deletes current document
     */

    deleteDocument(storageRelativePath) {
        WrioActions.busy(true);
        deleteFromS3(storageRelativePath).then((res)=>{
            WrioActions.busy(false);
            this.setState({
                error: false
            });
            parent.postMessage(JSON.stringify({
                "followLink": `https://wr.io/${WrioStore.getWrioID()}/Plus-WRIO-App/index.html`
            }), "*");
        }).catch((err)=>{
            WrioActions.busy(false);
            this.setState({
                error: true
            });
            console.log(err);
        });
    }

}

CoreEditor.propTypes = {
    doc: React.PropTypes.object,
    saveRelativePath: React.PropTypes.string,
    editUrl: React.PropTypes.string,
    author: React.PropTypes.string,
};


function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
}


const BLOCK_TYPES = [
    {
        label: 'Header',
        style: 'header-two'
    },
    /*{
        label: 'Blockquote',
        style: 'blockquote'
    }, {
        label: 'UL',
        style: 'unordered-list-item'
    }, {
        label: 'OL',
        style: 'ordered-list-item'
    }, */
     {
        label: 'Link',
        style: 'link'
    },
    {
        label: 'Embed Image or Social Media',
        style: 'image'
    }
];

const BlockStyleControls = (props) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) => {
                if (type.style === 'link') {
                    return (<StyleButton
                        key={type.label}
                        active={type.style === blockType}
                        label={type.label}
                        onToggle={props.onLinkToggle}
                        style={type.style}
                    />);
                }
                else if (type.style === 'image') {
                    return (<StyleButton
                        key={type.label}
                        active={type.style === blockType}
                        label={type.label}
                        onToggle={props.onImageToggle}
                        style={type.style}
                        />);
                }
                else {
                    return (<StyleButton
                        key={type.label}
                        active={type.style === blockType}
                        label={type.label}
                        onToggle={props.onToggle}
                        style={type.style}
                    />);
                }
            })}
          </div>
    );
};

BlockStyleControls.propTypes = {
    editorState: React.PropTypes.object,
    onToggle: React.PropTypes.func,
    onLinkToggle: React.PropTypes.func,
    onImageToggle: React.PropTypes.func
};

var INLINE_STYLES = [
    {
        label: 'Bold',
        style: 'BOLD'
    }, {
        label: 'Italic',
        style: 'ITALIC'
    }, {
        label: 'Underline',
        style: 'UNDERLINE'
    }, {
        label: 'Monospace',
        style: 'CODE'
    }
];

const InlineStyleControls = (props) => {
    let {
        editorState
    } = props;
    var currentStyle = editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
              <StyleButton
                key={type.label}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
              />
            )}
          </div>
    );
};

InlineStyleControls.propTypes = {
    editorState: React.PropTypes.object,
    onToggle: React.PropTypes.func
};

class ActionButton extends React.Component {
    constructor() {
        super();
        this.onToggle = this.onToggle.bind(this);
    }
    onToggle(e) {
        e.preventDefault();
        this.props.onToggle(this.props.action);
    };
    render() {
        let className = 'RichEditor-styleButton';
        return (
            <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        );
    }
}

ActionButton.propTypes = {
    onToggle: React.PropTypes.func,
    label: React.PropTypes.string,
    action: React.PropTypes.string
};

const styles = {
    root: {
        fontFamily: '\'Arial\', serif',
        padding: 20,
        width: 600,
    },
    buttons: {
        marginBottom: 10,
    },
    linkTitleInputContainer: {
        marginBottom: 10,
    },
    linkTitleInput: {
        fontFamily: '\'Arial\', serif',
        marginRight: 10,
        padding: 3,
    },
    editor: {
        cursor: 'text',
        minHeight: 80,
        padding: 0,
    },
    button: {
        marginTop: 10,
        textAlign: 'center'
    }
};


export default CoreEditor;

// hack to supppress warnings
console.error = (function() {
    var error = console.error;

    return function(exception) {
        if ((exception + '').indexOf('Warning: A component is `contentEditable`') != 0) {
            error.apply(console, arguments);
        }
    };
})();