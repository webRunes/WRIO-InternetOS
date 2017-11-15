import React from 'react';
import PropTypes from 'prop-types';

export default class Thumbnail extends React.Component {
  render() {
    return (
      <div
        className="img"
        style={{
          background: `url(${this.props.image})`,
          backgroundPosition: 'center center no-repeat',
        }}
      />
    );
  }
}

Thumbnail.propTypes = {
  image: PropTypes.string.isRequired,
};
