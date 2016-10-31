import React from 'react';

export default class Thumbnail extends React.Component {
    render () {
        return (
                <div className="img pull-left" style={{background:`url(${this.props.image})`}}></div>);
    }
}

Thumbnail.propTypes =  {
    image: React.PropTypes.string.isRequired
};
