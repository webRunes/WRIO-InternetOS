import React from 'react';
import ReactDOM from 'react-dom';
import User from './components/User';
import Info from './components/Info';
import PaymentForm from './components/PaymentForm';
import request from 'superagent';
import PaymentHistory from './components/PaymentHistory';
import EthereumClient from './components/EthereumClient';
import { Router,Route, Link } from 'react-router';
import moment from 'moment';
import {Modal,Button} from 'react-bootstrap';
import Const from '../../constant.js';

import numeral from 'numeral';
const SATOSHI = Const.SATOSHI;

class EthereumStats extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            ethBalance: "",
            wrgBalance: ""

        };
    }

    requestStats(cb) {
        request.get('/api/webgold/coinadmin/master').end((err,balance)=> {
            if (err) {
                cb(err);
                return;
            }
            cb(null,JSON.parse(balance.text));
        });
    }

    componentWillMount() {
       this.requestStats((err,state) => {
           if (err) {
               alert('Cant get stats. \n'+err);
               return;
           }
           console.log(state);
           this.setState(state);
       });

        request.get('/api/blockchain/get_gap').
            set('X-Requested-With',"XMLHttpRequest").
            end((err,res) => {
            if (err) {
                console.log("Can't get blockchain address gap");
                return;
            }
            console.log(res.text);
            this.setState(JSON.parse(res.text));
        });
        this.getLatestBlockEtherscan();
    }

    getLatestBlockEtherscan() {
        let url = 'https://ropsten.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=3854N5NEEKKCP4E4EB26W5SRG5D8ZSBGSK';
        request.get(url).end((err,res) => {
            if (err) {
                console.log("Can't get stats from Etherscan");
                return;
            }
            let text = JSON.parse(res.text);
            this.setState({masterLatestBlock:parseInt(text.result,16)});
        });
    }



    render() {
        let sync = this.getSyncBlock();
        let master = "https://ropsten.etherscan.io/address/" + this.state.masterAddr;
        return (
            <div>
                <h1>Webgold admin</h1>
                <h2>Feed account stats</h2>
                <p> Master account:<a href={master}> { this.state.ethBalance } ETH </a>  </p>
                <p> Master account: { this.state.wrgBalance } WRG </p>
                <p> Latest block {this.state.latest} (local) / {this.state.masterLatestBlock} (exact). If local block is lower than
                remote one, then there is some problem with local node, most likely it was stuck at some old block</p>
                <p> Gas price: { this.state.gasPrice } WRG </p>
                {sync}
                <p> Blockchain.info address gap: {this.state.gap} . <b> Warning! If gap > 20 we will be unable to generate new bitcoin incoming adresses!</b></p>
            </div>

        );
    }

    getSyncBlock() {
        if (this.state.syncing) {
            return (<p>Sync ok</p>);
        } else {
            return (<p> Sync in progress: #{this.state.currentBlock} /  #{this.state.highestBlock} </p>);
        }
    }
}

class Balances extends React.Component {


    constructor(props) {
        console.log("Balances created");
        super(props);

        this.state = {
            data:[

            ],
            modalContent: null
        };
    }

    requestUsers(cb) {
        request.get('/api/webgold/coinadmin/users').end((err,users)=> {
            if (err) {
                cb(err);
                return;
            }
            cb(null,JSON.parse(users.text));
        });
    }

    componentWillMount() {
        var that = this;

        this.requestUsers((err,state) => {
            if (err) {
                alert('Cant get users \n'+err);
                return;
            }
            that.setState({
                data: state,
                showModal:false
            });
        });
    }

    close() {
        console.log("modal closed");
        this.setState({showModal:false});
    }

    showModal(prepayments) {
        console.log(this,prepayments);
        this.setState({
            showModal:true,
            modalContent: prepayments
        });
    }

    render() {
        //var data = this.state.data[0];
        var data = [];


        return (
            <div>
                <h2>User's balance</h2>

                <table className="table">
                    <thead>
                    <tr>
                        <th>WRIOID</th>
                        <th>NAME</th>
                        <th>ETH ADRESS</th>
                        <th>ETH BALANCE</th>
                        <th>TEMP BALANCE(DB)</th>
                        <th>WRG BALANCE</th>
                        <th>RTX COINS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {
                            var explorerLink = "https://ropsten.etherscan.io/address/"+item.ethWallet;
                            return  (<tr>
                                <td>{ item.wrioID }</td>
                                <td>{ item.name }</td>
                                <td><a href={explorerLink}>{ item.ethWallet}</a></td>
                                <td>{ item.ethBalance}</td>
                                <td onClick={this.showModal.bind(this,item.widgets)}>{ item.dbBalance}</td>
                                <td>{ item.wrgBalance}</td>
                                <td>{ item.rtxBalance}</td>

                            </tr>);
                        }.bind(this))}

                    </tbody>
                </table>
                <Modal show={this.state.showModal}  onHide={this.close.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>PrePayments</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { this.state.modalContent ?  <PrePayments data= { this.state.modalContent } /> : ""}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
}

class Emissions extends React.Component {


    constructor(props) {
        console.log("Balances created");
        super(props);

        this.state = {
            data:[

            ]
        };
    }

    requestUsers(cb) {
        request.get('/api/webgold/coinadmin/emissions').end((err,users)=> {
            if (err) {
                cb(err);
                return;
            }
            cb(null,JSON.parse(users.text));
        });
    }

    componentWillMount() {
        var that = this;

        this.requestUsers((err,state) => {
            if (err) {
                alert('Cant get users \n'+err);
                return;
            }
            that.setState({
                data: state
            });
        });
    }

    render() {
        return (
            <div>
                <h2>WRG emission list</h2>
                <p>List of newly emitted WRG's</p>
                <table className="table">
                    <thead>
                    <tr>
                        <th>WRIOID</th>
                        <th>Amount</th>
                        <th>Timestamp</th>

                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {

                            return  (<tr>
                                <td>{ item.userID }</td>
                                <td>{ item.amount / 100 }</td>
                                <td>{  moment(item.timestamp).format("H:mm:ss DD.MM.YYYY")  }</td>

                            </tr>);
                        })}

                    </tbody>
                </table>
            </div>

        );
    }
}

class Donations extends React.Component {


    constructor(props) {
        console.log("Balances created");
        super(props);

        this.state = {
            data:[

            ]
        };
    }

    requestUsers(cb) {
        request.get('/api/webgold/coinadmin/donations').end((err,users)=> {
            if (err) {
                cb(err);
                return;
            }
            cb(null,JSON.parse(users.text));
        });
    }

    componentWillMount() {
        var that = this;

        this.requestUsers((err,state) => {
            if (err) {
                alert('Cant get users \n'+err);
                return;
            }
            that.setState({
                data: state
            });
        });
    }

    render() {
        return (
            <div>
                <h2>WRG donations list</h2>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Amount</th>
                        <th>Timestamp</th>
                        <th>Success</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {

                            return  (<tr>
                                <td>{ item.srcWrioID }</td>
                                <td>{ item.destWrioID }</td>
                                <td>{ item.amount / 100 }</td>
                                <td>{  moment(item.timestamp).format("H:mm:ss DD.MM.YYYY") }</td>
                                <td></td>
                            </tr>);
                        })}

                    </tbody>
                </table>
            </div>

        );
    }
}

class EtherFeeds extends React.Component {


    constructor(props) {
        console.log("Balances created");
        super(props);

        this.state = {
            data:[

            ]
        };
    }

    requestUsers(cb) {
        request.get('/api/webgold/coinadmin/etherfeeds').end((err,users)=> {
            if (err) {
                cb(err);
                return;
            }
            cb(null,JSON.parse(users.text));
        });
    }

    componentWillMount() {
        var that = this;

        this.requestUsers((err,state) => {
            if (err) {
                alert('Cant get users \n'+err);
                return;
            }
            that.setState({
                data: state
            });
        });
    }

    render() {
        return (
            <div>
                <h2>Ether Feed list</h2>
                <p>Description: to ensure proper user account operation each accound is feeded with minimal ether amount to perform opartion. Each ether withdrawal by user is logged in this page</p>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Ethereum account</th>
                        <th>Timestamp</th>

                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {

                            return  (<tr>
                                <td>{ item.amount }</td>
                                <td>{ item.eth_account }</td>
                                <td>{  moment(item.timestamp).format("H:mm:ss DD.MM.YYYY")  }</td>
                            </tr>);
                        })}

                    </tbody>
                </table>
            </div>

        );
    }
}


class PrePayments extends React.Component {


    constructor(props) {
        console.log("Balances created");
        super(props);

        this.state = {
            data:props.data
        };
    }


    render() {
        return (
            <div>
                <p>List of deferred payments, when user have 0 WRG balance</p>
                <table className="table">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>TO</th>
                        <th>AMOUNT</th>

                        <th>TIMESTAMP</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {

                            return  (<tr>
                                <td>{ item.id }</td>
                                <td>{ item.to }</td>
                                <td>{ item.amount / 100 }</td>
                                <td>{ moment(item.timestamp).format("H:mm:ss DD.MM.YYYY") }</td>
                            </tr>);
                        })}

                    </tbody>
                </table>
            </div>

        );
    }
}

PrePayments.propTypes = {
    data: React.PropTypes.object
};

class Invoices extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[

            ]

        };

    }

    componentDidMount() {

        console.log("Mounted");
        request.get('/api/webgold/coinadmin/invoices').end((err,res) => {
            if (err || !res) {
                console.log("Can't get payment history");
                return;
            }
            this.setState({
                data: res.body
            });
        });


    }

    render() {
        return (
            <div>
                <h1>Registered invoices</h1>

                <table className="table">
                    <thead>
                    <tr>
                        <th>Wrio ID</th>
                        <th>Bitcoin Adress</th>
                        <th>Amount</th>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {
                            var amount = (item.amount || item.requested_amount)/SATOSHI;
                            if (isNaN(amount)) {
                                amount = "Error";
                            } else {
                                amount = numeral(amount).format('0.00000000') + " BTC";
                            }
                            return  (<tr>
                                <td> {item.wrioID}</td>
                                <td>{ item.input_address }</td>
                                <td>{ amount }</td>
                                <td>{ moment(item.timestamp).format("H:mm:ss DD.MM.YYYY")  }</td>
                                <td>{ item.state}</td>
                            </tr>);
                        })}

                    </tbody>
                </table>
            </div>
        );
    }
}

class Presales extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[

            ]

        };

    }

    componentDidMount() {

        console.log("Mounted");
        request.get('/api/webgold/coinadmin/presales').end((err,res) => {
            if (err || !res) {
                console.log("Can't get payment history");
                return;
            }
            this.setState({
                data: res.body
            });
        });


    }

    render() {
        return (
            <div>
                <h1>Registered presales</h1>

                <table className="table">
                    <thead>
                    <tr>
                        <th>Ethereum ID</th>
                        <th>BTC Adress</th>
                        <th>BTC Amount</th>
                        <th>Time</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(function (item) {
                            var amount = (item.amount || item.requested_amount)/SATOSHI;
                            if (isNaN(amount)) {
                                amount = "Error";
                            } else {
                                amount = numeral(amount).format('0.00000000') + " BTC";
                            }
                            return  (<tr>
                                <td> {item.ethID || ""}</td>
                                <td>{ item.address || "" }</td>
                                <td>{ amount || ""}</td>
                                <td>{ moment(item.timestamp).format("H:mm:ss DD.MM.YYYY")  }</td>
                                <td>{ item.email || ""}</td>
                                <td>{ item.state || ""}</td>
                            </tr>);
                        })}

                    </tbody>
                </table>
            </div>
        );
    }
}


export function RenderAdmin() {

//console.log(Router,Route);
    ReactDOM.render((
        <Router>
            <Route path="/" component={EthereumStats} />
            <Route path="/balances" component={Balances}/>
            <Route path="/etherfeeds" component={EtherFeeds}/>
            <Route path="/donations" component={Donations}/>
            <Route path="/emissions" component={Emissions}/>
            <Route path="/invoices" component={Invoices}/>
            <Route path="/presales" component={Presales}/>
        </Router>
    ), document.getElementById('main'));

}

