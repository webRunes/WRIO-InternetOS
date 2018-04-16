/**
 * Created by michbil on 16.07.17.
 */
import React from 'react';
import StyleButton from './StyleButton.js';
import PropTypes from 'prop-types';

const CONTROLS_TYPES_ARTICLE = [
  {
    label: 'Header',
    style: 'header-two',
  },
  /* {
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
    style: 'link',
  },
  {
    label: 'Embed Image or Social Media',
    style: 'image',
  },
  {
    label: 'Insert Ticket',
    style: 'ticket',
  },
];

const CONTROLS_TYPES_COVER = [
  /*
  {
    label: 'Header',
    style: 'header-two',
  },
  {
    label: 'Blockquote',
    style: 'blockquote'
  },
  {
    label: 'UL',
    style: 'unordered-list-item'
  },
  {
    label: 'OL',
    style: 'ordered-list-item'
  },
  */
  {
    label: 'Link',
    style: 'link',
  }/*,
  {
    label: 'Embed Image or Social Media',
    style: 'image',
  },
  {
    label: 'Insert Ticket',
    style: 'ticket',
  },*/
];

export const BlockStyleControls = (props) => {
  const { editorState, editorName } = props;
  const controls = editorName === 'COVEREDITOR_'
    ? CONTROLS_TYPES_COVER
    : CONTROLS_TYPES_ARTICLE;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls">
      {controls.map((type) => {
        if (type.style === 'link') {
          return (
            <StyleButton
              key={type.label}
              active={type.style === blockType}
              label={type.label}
              onToggle={props.onLinkToggle}
              style={type.style}
            />
          );
        } else if (type.style === 'image') {
          return (
            <StyleButton
              key={type.label}
              active={type.style === blockType}
              label={type.label}
              onToggle={props.onImageToggle}
              style={type.style}
            />
          );
        } else if (type.style === 'ticket') {
          return (
            <StyleButton
              key={type.label}
              active={type.style === blockType}
              label={type.label}
              onToggle={props.onTicketToggle}
              style={type.style}
            />
          );
        }
        return (
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        );
      })}
    </div>
  );
};

BlockStyleControls.propTypes = {
  editorState: PropTypes.object,
  editorName: PropTypes.string,
  onToggle: PropTypes.func,
  onLinkToggle: PropTypes.func,
  onTicketToggle: PropTypes.func,
  onImageToggle: PropTypes.func,
};

const INLINE_STYLES = [
  {
    label: 'Bold',
    style: 'BOLD',
  },
  {
    label: 'Italic',
    style: 'ITALIC',
  },
  {
    label: 'Underline',
    style: 'UNDERLINE',
  },
  {
    label: 'Monospace',
    style: 'CODE',
  },
];

export const InlineStyleControls = (props) => {
  const { editorState } = props;
  const currentStyle = editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

InlineStyleControls.propTypes = {
  editorState: PropTypes.object,
  onToggle: PropTypes.func,
};

export class ActionButton extends React.Component {
  constructor() {
    super();
    this.onToggle = this.onToggle.bind(this);
  }
  onToggle(e) {
    e.preventDefault();
    this.props.onToggle(this.props.action);
  }
  render() {
    const className = 'RichEditor-styleButton';
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

ActionButton.propTypes = {
  onToggle: PropTypes.func,
  label: PropTypes.string,
  action: PropTypes.string,
};

const styles = {
  root: {
    fontFamily: "'Arial', serif",
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
    fontFamily: "'Arial', serif",
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
    textAlign: 'center',
  },
};
