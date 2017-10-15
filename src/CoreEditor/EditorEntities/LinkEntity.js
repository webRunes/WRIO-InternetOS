/**
 * Created by michbil on 07.08.16.
 */

import React from "react";
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
  Modifier
} from "draft-js";
import PropTypes from "prop-types";

// link template component for the editor

export default class Link extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getProps(props);
    this.onLinkEdit = this.onLinkEdit.bind(this);
  }

  getProps(props) {
    const { linkTitle, linkUrl, linkDesc, editCallback } = Entity.get(
      props.entityKey
    ).getData();
    console.log(props.decoratedText);
    return {
      linkTitle: props.decoratedText || linkTitle,
      linkUrl,
      linkDesc,
      entityKey: props.entityKey,
      linkCallback: editCallback
    };
  }

  onLinkEdit(e) {
    e.preventDefault();
    this.state.linkCallback(
      this.state.linkTitle,
      this.state.linkUrl,
      this.state.linkDesc,
      this.state.entityKey
    );
  }

  componentWillReceiveProps(props) {
    this.setState(this.getProps(props));
  }
  render() {
    return (
      <a href={this.state.linkUrl} onClick={this.onLinkEdit}>
        {this.props.children}
      </a>
    );
  }
}

Link.propTypes = {
  entityKey: PropTypes.string,
  children: PropTypes.array
};
