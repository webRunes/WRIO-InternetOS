import React from 'react';
import {getServiceUrl,getDomain} from '../WRIO-InternetOS/js/servicelocator.js';

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

        window.addEventListener('message', function (e) {

                var message = e.data;
                var httpChecker = new RegExp('^(http|https)://webgold.' + domain, 'i');
                if (httpChecker.test(e.origin)) {
                    var jsmsg = JSON.parse(message);

                    if (jsmsg.transactionsHeight) {
                        document.getElementById('transactionsiframe').style.height = jsmsg.transactionsHeight+'px';
                    }
                };
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
