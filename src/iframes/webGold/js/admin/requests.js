/**
 * Created by michbil on 13.06.17.
 */
import request from 'superagent';

export async function requestStats() : string  {
    const balance = await request.get('/api/webgold/coinadmin/master');
    return JSON.parse(balance.text);
}

export async function requestGap() : string  {
    const res = await request.get('/api/blockchain/get_gap').
    set('X-Requested-With',"XMLHttpRequest");
    return JSON.parse(res.text);
}

export async function getLatestBlockEtherscan() : string {
    let url = 'https://ropsten.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=3854N5NEEKKCP4E4EB26W5SRG5D8ZSBGSK';
    const res = await request.get(url);
    const text = JSON.parse(res.text);
    return parseInt(text.result,16)
}