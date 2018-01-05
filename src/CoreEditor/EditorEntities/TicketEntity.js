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
import request from 'superagent';
import PropTypes from 'prop-types';
import Ticket from 'base/components/Ticket';

// image template component for the editor

export default class TicketEntity extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getProps(props);
    this.onLinkEdit = this.onLinkEdit.bind(this);
  }

  getProps(props) {
    const {
      src, description, title, image, editCallback, ...rest
    } = Entity.get(props.entityKey).getData();
    console.log('TICKET', props.decoratedText, rest);

    return {
      src,
      description,
      title,
      image,
      entityKey: props.entityKey,
      linkCallback: editCallback,
    };
  }

  onLinkEdit(e) {
    e.preventDefault();
    this.state.linkCallback(
      this.state.title,
      this.state.src,
      this.state.description,
      this.state.entityKey,
    );
  }

  componentWillReceiveProps(props) {
    this.setState(this.getProps(props));
  }

  getContent() {
    if (this.state.type == 'link') {
      const data = this.state.object;
      return (
        <a href={data.url}>
          <img src={data.thumbnail_url} alt={data.description} />
        </a>
      );
    }
    return <div ref="contentblock" />;
  }

  render() {
    const content = this.getContent();
    const {
      title, description, image, url,
    } = this.state;
    return (
      <div onClick={this.onLinkEdit}>
        <Ticket content={content} title={title} description={description} image={image} url={url} />
      </div>
    );
  }
}

TicketEntity.propTypes = {
  entityKey: PropTypes.string,
  children: PropTypes.array,
};
