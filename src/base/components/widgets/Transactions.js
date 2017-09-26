import React from 'react';
import {getServiceUrl,getDomain} from '../../servicelocator.js';
import {transactionsHeight} from 'base/actions/WindowMessage'
var domain = getDomain();

const transFrameUrl =  getServiceUrl('webgold') + '/transactions';

class CreateTransactions extends React.Component {
   constructor(props) {
       super(props);
       
    }

  

    createTransactionsWidget () {
        var twheight = 10000;
        document.getElementById('transactionsiframe').style.height = '240px';
        webGoldMessage.subscribe(ht=> {
                document.getElementById('transactionsiframe').style.height = ht+'px';
        });

    }


    componentDidMount () {
        this.createTransactionsWidget();
    }

    render() {
        const editIframeStyles =  {
            width: '100%',
            border: 'none'
        }
        return (
            <div>
                <section key="b">
                    <iframe id="transactionsiframe" src={transFrameUrl} frameBorder="no" scrolling="no" style={ this.editIframeStyles }/>
                </section>
            </div>
        );
    }
};

export default CreateTransactions;
