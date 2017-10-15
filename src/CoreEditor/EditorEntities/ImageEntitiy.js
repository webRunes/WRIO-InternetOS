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

// image template component for the editor

export default class ImageEntity extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getProps(props);
    this.onLinkEdit = this.onLinkEdit.bind(this);
  }

  getProps(props) {
    const { src, description, title, editCallback } = Entity.get(
      props.entityKey
    ).getData();
    console.log(props.decoratedText);
    return {
      src,
      description,
      title,
      entityKey: props.entityKey,
      linkCallback: editCallback
    };
  }

  onLinkEdit(e) {
    e.preventDefault();
    this.state.linkCallback(
      this.state.title,
      this.state.src,
      this.state.description,
      this.state.entityKey
    );
  }

  componentWillReceiveProps(props) {
    this.setState(this.getProps(props));
  }
  render() {
    return (
      <article onClick={this.onLinkEdit}>
        <figure>
          <img src={this.state.src} />
          <figcaption className="callout figure-details">
            <h5>{this.state.title}</h5>
            <p>{this.state.description}</p>
          </figcaption>
        </figure>
      </article>
    );
  }
}

ImageEntity.propTypes = {
  entityKey: PropTypes.string,
  children: PropTypes.array
};
