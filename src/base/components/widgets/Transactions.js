import React from 'react';
import {getServiceUrl,getDomain} from '../../servicelocator.js';
import WindowActions from '../../actions/WindowActions.js';
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
        WindowActions.webGoldMessage.listen((msg)=> {
            if (msg.transactionsHeight) {
                document.getElementById('transactionsiframe').style.height = msg.transactionsHeight+'px';
            }
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
