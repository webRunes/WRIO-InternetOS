import React from 'react';
import Reflux from 'reflux';
import {
  CompositeDecorator,
  ContentState,
  SelectionState,
  Editor,
  EditorState,
  Entity,
  RichUtils,
  CharacterMetadata,
  getDefaultKeyBinding,
  Modifier,
  convertToRaw,
} from 'draft-js';
import { deleteFromS3 } from '../webrunesAPI.js';
import PropTypes from 'prop-types';
import Alert from '../components/Alert.js';

import EntityTools, { getSelection } from '../utils/entitytools';

import {
  BlockStyleControls,
  InlineStyleControls,
  ActionButton,
} from '../components/EditorControls';
import mkEditorActions from '../actions/indexActions';
import { openImageDialog } from '../actions/imagedialog';
import { openLinkDialog } from '../actions/linkdialog';

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}

class EditorComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.onLinkControlClick = this.onLinkControlClick.bind(this);
    this.onImageControlClick = this.onImageControlClick.bind(this);

    setTimeout(this.focus.bind(this), 200);
    window.editorFocus = this.onFocus.bind(this);
    this.editorChanged = mkEditorActions(this.props.editorName).editorChanged; // map action name to particular editor name
  }

  onFocus() {
    setTimeout(() => this.focus(), 0);
  }

  onLinkControlClick() {
    const title = getSelection(this.props.editorState);
    this.props.dispatch(openLinkDialog(title, '', ''));
  }

  onImageControlClick() {
    const title = getSelection(this.props.editorState);
    this.props.dispatch(openImageDialog(title, '', ''));
  }

  focus() {
    if (this.editorRef) {
      this.editorRef.focus();
    }
  }

  handleChange(editorState) {
    console.log(convertToRaw(editorState.getCurrentContent()));
    this.props.dispatch(this.editorChanged(editorState));
  }

  handleKeyCommand(command) {
    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.props.dispatch(this.editorChanged(newState));
      return true;
    }
    return false;
  }

  toggleBlockType(blockType) {
    this.props.dispatch(this.editorChanged(RichUtils.toggleBlockType(this.props.editorState, blockType)));
  }

  toggleInlineStyle(inlineStyle) {
    this.props.dispatch(this.editorChanged(RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle)));
  }

  render() {
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    if (!this.props.editorState) {
      return null;
    }
    const contentState = this.props.editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== 'unstyled'
      ) {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="clearfix">
        <div>
          <div className="RichEditor-root form-group">
            <BlockStyleControls
              editorState={this.props.editorState}
              onToggle={this.toggleBlockType}
              onLinkToggle={this.onLinkControlClick}
              onImageToggle={this.onImageControlClick}
            />

            {false && (
              <InlineStyleControls editorState={editorState} onToggle={this.toggleInlineStyle} />
            )}

            <div className={className} onClick={() => this.focus}>
              <Editor
                blockStyleFn={getBlockStyle}
                editorState={this.props.editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={el => this.handleChange(el)}
                placeholder="Enter text..."
                ref={(ref) => {
                  this.editorRef = ref;
                }}
                spellCheck
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditorComponent.propTypes = {
  editorState: PropTypes.object,
  dispatch: PropTypes.func,
  editorName: PropTypes.string.isRequired,
};

export default EditorComponent;
