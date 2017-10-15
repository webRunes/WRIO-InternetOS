/**
 * Created by michbil on 07.08.16.
 */
import React from "react";
import PropTypes from "prop-types";

export default class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = this.onToggle.bind(this);
  }
  onToggle(e) {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  }
  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

StyleButton.propTypes = {
  onToggle: PropTypes.func,
  style: PropTypes.string,
  active: PropTypes.bool,
  label: PropTypes.string
};
