import React from 'react';

export default class Thumbnail extends React.Component {
    render () {
        return (
                <div className="img pull-left" style={{
                    background:`url(${this.props.image})`,
                    width: "120px","height": "80px",
                    "backgroundSize":"cover"
                  }}></div>);
    }
}

Thumbnail.propTypes =  {
    image: React.PropTypes.string.isRequired
};
