import React from 'react';
import Actions from '../WRIO-InternetOS/js/actions/center';
import Details from'./Details.jsx';
import moment from 'moment';
import {getServiceUrl,getDomain} from '../WRIO-InternetOS/js/servicelocator.js';
import WindowActions from '../WRIO-InternetOS/js/actions/WindowActions.js';

var domain = getDomain();

class Login extends React.Component{
    constructor(props) {
        super(props);
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
            <iframe id="coreiframe" src={getServiceUrl('core')+'/create'} style={ this.editIframeStyles }/>
        );
    }
}

module.exports = Login;