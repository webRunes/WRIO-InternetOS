/**
 * Created by michbil on 07.08.16.
 */

import React from 'react';
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
} from 'draft-js';
import PropTypes from 'prop-types';
import { linkEditCallback } from '../utils/entitytools';

// link template component for the editor

export default class Link extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getProps(props);
    this.onLinkEdit = this.onLinkEdit.bind(this);
  }

  getProps(props) {
    const {
      linkTitle, href, linkDesc, editCallback,
    } = Entity.get(props.entityKey).getData();
    return {
      linkTitle: props.decoratedText || linkTitle,
      href,
      linkDesc,
      entityKey: props.entityKey,
      linkCallback: linkEditCallback,
    };
  }

  onLinkEdit(e) {
    e.preventDefault();
    this.state.linkCallback(
      this.state.linkTitle,
      this.state.href,
      this.state.linkDesc,
      this.state.entityKey,
    );
  }

  componentWillReceiveProps(props) {
    this.setState(this.getProps(props));
  }
  render() {
    return (
      <a href={this.state.href} onClick={this.onLinkEdit}>
        {this.props.children}
      </a>
    );
  }
}

Link.propTypes = {
  entityKey: PropTypes.string,
  children: PropTypes.array,
};
