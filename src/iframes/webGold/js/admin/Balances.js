/**
 * Created by michbil on 13.06.17.
 */
import React from 'react';
import request from 'superagent';
import {Modal,Button} from 'react-bootstrap';
import Const from '../../../constant.js';
const SATOSHI = Const.SATOSHI;

const UsersTable = ({data,showModal}) => {
    return ( <table className="table">
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
            data.map(function (item) {
                var explorerLink = "https://ropsten.etherscan.io/address/"+item.ethWallet;
                return  (<tr>
                    <td>{ item.wrioID }</td>
                    <td>{ item.name }</td>
                    <td><a href={explorerLink}>{ item.ethWallet}</a></td>
                    <td>{ item.ethBalance}</td>
                    <td onClick={() => showModal(item.widgets)}>{ item.dbBalance}</td>
                    <td>{ item.wrgBalance}</td>
                    <td>{ item.rtxBalance}</td>

                </tr>);
            }.bind(this))}

        </tbody>
    </table>);
};

export default class Balances extends React.Component {


    constructor(props) {
        console.log("Balances created");
        super(props);

        this.state = {
            data:null,
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
        return (
            <div>
                <h2>User's balance</h2>
                    {this.state.data ? <UsersTable
                        data={this.state.data}
                        showModal={this.showModal.bind(this)}
                    /> :
                        <img src="https://default.wrioos.com/img/loading.gif" />}

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
