import React from 'react';
import Reflux from 'reflux';
import {CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata, getDefaultKeyBinding,  Modifier, convertToRaw} from 'draft-js';
import {deleteFromS3} from '../webrunesAPI.js';

import Alert from '../components/Alert.js';


import EntityTools,{getSelection} from '../utils/entitytools'

import {BlockStyleControls,InlineStyleControls,ActionButton} from '../components/EditorControls'
import {editorChanged,publishDocument,deleteDocument} from '../actions/indexActions'
import {openImageDialog} from '../actions/imagedialog'
import {openLinkDialog} from '../actions/linkdialog'

class EditorComponent extends React.Component {
    constructor(props) {
        super(props);


        this.handleKeyCommand   = this.handleKeyCommand.bind(this);
        this.toggleBlockType    = this.toggleBlockType.bind(this);
        this.toggleInlineStyle  = this.toggleInlineStyle.bind(this);
        this.onLinkControlClick = this.onLinkControlClick.bind(this);
        this.onImageControlClick = this.onImageControlClick.bind(this);

        setTimeout(this.focus.bind(this),200);
        window.editorFocus = this.onFocus.bind(this);
    }



    handleChange (editorState) {
        console.log(convertToRaw(editorState.getCurrentContent()));
        this.props.dispatch(editorChanged(editorState));
    }

    focus() {
        if (this.refs.editor) {
            this.refs.editor.focus();
        }
       
    }
    onFocus()
    {
        setTimeout(() => this.focus(), 0);
    }

    onLinkControlClick() {
        var title = getSelection(this.props.editorState);
        this.props.dispatch(openLinkDialog(title,"",""))
    }

    onImageControlClick() {
        var title =  getSelection(this.props.editorState);
        this.props.dispatch(openImageDialog(title,"",""))
    }


    handleKeyCommand(command) {
        const editorState = this.props.editorState;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.props.dispatch(editorChanged(newState));
            return true;
        }
        return false;
    }

    toggleBlockType(blockType) {
        this.props.dispatch(editorChanged((
            RichUtils.toggleBlockType(
                this.props.editorState,
                blockType
            )
        )));
    }

    toggleInlineStyle(inlineStyle) {
        this.props.dispatch(editorChanged((
            RichUtils.toggleInlineStyle(
                this.props.editorState,
                inlineStyle
            )
        )));
    }

    myKeyBindingFn(e) {
      if (e.keyCode === 13) {
        window.frameReady();
      }
      return getDefaultKeyBinding(e);
    }

    render() {
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        if (!this.props.editorState) {
            return null;
        }
        var contentState = this.props.editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <div className="clearfix">
            <div >
                <div className="RichEditor-root form-group">
                  <BlockStyleControls
                    editorState={this.props.editorState}
                    onToggle={this.toggleBlockType}
                    onLinkToggle={this.onLinkControlClick}
                    onImageToggle={this.onImageControlClick}
                  />

                  { false && <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                  />}
                 
                  <div className={className} onClick={()=>this.focus}>
                    <Editor
                      blockStyleFn={getBlockStyle}
                      editorState={this.props.editorState}
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

            </div>
        );
    }

    


}

EditorComponent.propTypes = {
    editorState: React.PropTypes.object,
    dispatch: React.PropTypes.func,
};


function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
}


export default EditorComponent;
