/**
 * Created by michbil on 31.10.16.
 */
import React from 'react';
import {getServiceUrl,getDomain} from '../core/servicelocator.js';
import WindowActions from '../core/actions/WindowActions.js';
var domain = getDomain();

var CreatePresale = React.createClass({
    getInitialState: function() {
        return({
            iframeUrl: getServiceUrl('webgold') + '/presale'
        });
    },
    editIframeStyles: {
        width: '100%',
        border: 'none'
    },
    createPresaleWidget: function() {
        var twheight = 10000;
        document.getElementById('presaleiframe').style.height = '480px';
        WindowActions.webGoldMessage.listen((msg)=> {
            if (msg.transactionsHeight) {
                document.getElementById('presaleiframe').style.height = msg.transactionsHeight+'px';
            }
        });

    },
    componentDidMount: function() {
        this.createPresaleWidget();
    },
    render: function() {
        return (
            <div>
                <section key="b">
                    <iframe id="presaleiframe" src={this.state.iframeUrl} frameBorder="no" scrolling="no" style={ this.editIframeStyles }/>
                </section>
            </div>
        );
    }
});

export default CreatePresale;
