import React from 'react';
import {getServiceUrl,getDomain} from '../../servicelocator.js';
import {transactionsHeight} from 'base/actions/WindowMessage'
var domain = getDomain();

var CreateTransactions = React.createClass({
    getInitialState: function() {
        return({
            transactionsFrameUrl: getServiceUrl('webgold') + '/transactions'
        });
    },
    editIframeStyles: {
        width: '100%',
        border: 'none'
    },
    createTransactionsWidget: function() {
        var twheight = 10000;
        document.getElementById('transactionsiframe').style.height = '240px';
        webGoldMessage.subscribe(ht=> {
                document.getElementById('transactionsiframe').style.height = ht+'px';
        });

    },
    componentDidMount: function() {
        this.createTransactionsWidget();
    },
    render: function() {
        return (
            <div>
                <section key="b">
                    <iframe id="transactionsiframe" src={this.state.transactionsFrameUrl} frameBorder="no" scrolling="no" style={ this.editIframeStyles }/>
                </section>
            </div>
        );
    }
});

export default CreateTransactions;
