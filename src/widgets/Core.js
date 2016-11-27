import React from 'react';
import {getServiceUrl,getDomain} from '../core/servicelocator.js';
import WindowActions from '../core/actions/WindowActions.js';

var domain = getDomain();

class Core extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            article: this.props.article
        };
   }

    componentDidMount() {
        WindowActions.coreMessage.listen((msg) => {
            if (msg.coreSaved) {
                window.location.reload();
            }
            if (msg.coreHeight) {
                document.getElementById('coreiframe').style.height = msg.coreHeight+'px';
            }
            if (msg.followLink) {
                window.location.href = msg.followLink;
            }
        });
    }

    render() {
        return (
            <div>
                {!this.state.article ?
                    <iframe id="coreiframe" className="core" src={getServiceUrl('core') + '/create'}/>
                               : <iframe id="coreiframe" className="core" src={getServiceUrl('core') + '/edit?article=' + encodeURIComponent(this.state.article)}/>}
            </div>
        );
    }
}

Core.propTypes = {
    article: React.PropTypes.string
};

module.exports = Core;