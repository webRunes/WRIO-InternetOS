import React from 'react';
import PropTypes from 'prop-types'

export default class Thumbnail extends React.Component {
    render () {
      return (
        <div className="img" style={{
          background:`url(${this.props.image})`,
           width: "120px","height": "80px",
           "backgroundSize":"cover"
        }}>
        </div>);
    }
}

Thumbnail.propTypes =  {
    image: PropTypes.string.isRequired
};
