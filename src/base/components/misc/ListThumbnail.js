import React from 'react';

export default class Thumbnail extends React.Component {
    render () {
      return (
        <div className="img" style={{
          background:`url(${this.props.image})`,
           backgroundPosition: 'center center no-repeat'
        }}>
        </div>);
    }
}

Thumbnail.propTypes =  {
    image: React.PropTypes.string.isRequired
};
