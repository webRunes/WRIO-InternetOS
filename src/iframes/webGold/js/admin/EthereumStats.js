/**
 * Created by michbil on 13.06.17.
 */

import React from 'react';
import request from 'superagent';
import Const from '../../../constant.js';
const SATOSHI = Const.SATOSHI;
import {requestStats,requestGap,getLatestBlockEtherscan} from './requests'

export default class EthereumStats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ethBalance: "",
            wrgBalance: ""

        };
    }

    async retrieveState () {
        try {
            console.log("Getting params");
            await Promise.all([(async () => {
                const stats = await requestStats();
                console.log("STATS",stats);
                this.setState(stats);
            })(),
            (async () => {
                const gap = await requestGap();
                console.log("GAP",gap);
                this.setState(gap);
            })(),
            (async () => {
                const block = await getLatestBlockEtherscan();
                console.log('LASTBLOCK',block);
                this.setState({masterLatestBlock:block});
            })()
            ]);}
        catch (e) {
            console.log("Error",e);
        }
    }


    componentDidMount() {
        this.retrieveState().then(()=>console.log("OK"));
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
