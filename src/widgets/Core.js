import React from 'react';
import {getServiceUrl,getDomain} from '../core/servicelocator.js';
import WindowActions from '../core/actions/WindowActions.js';

var domain = getDomain();

class Core extends React.Component{
    constructor(props) {
        super(props);
        this.editIframeStyles = {
            width: '100%',
            border: 'none',
            height: '240px'
        };
        this.state = {
            article: this.props.article
        };
   }

    componentDidMount() {
        WindowActions.coreMessage.listen((msg) => {
            if (msg.coreHeight) {
                document.getElementById('coreiframe').style.height = msg.coreHeight+'px';
            }
        });
    }

    render() {
        return (
            <div>
                {!this.state.article ?
                    <iframe id="coreiframe" src={getServiceUrl('core') + '/create'} style={ this.editIframeStyles }/>
                               : <iframe id="coreiframe"
                                         src={getServiceUrl('core') + '/edit?article=' + this.state.article}
                                         style={ this.editIframeStyles }/>}
            </div>
        );
    }
}

Core.propTypes = {
    article: React.PropTypes.string
};

module.exports = Core;