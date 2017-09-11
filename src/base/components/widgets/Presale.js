/**
 * Created by michbil on 31.10.16.
 */
import React from 'react';
import {getServiceUrl,getDomain} from '../../servicelocator.js';
import {webgoldHeight} from 'base/actions/WindowMessage'
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
        webgoldHeight.subscribe(ht=> {
                document.getElementById('presaleiframe').style.height = ht+'px';
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
