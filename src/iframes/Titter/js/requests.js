/**
 * Created by michbil on 06.03.17.
 */

import {getLoginUrl,getWebgoldUrl,getTitterUrl} from './utils.js';

export const sendCommentRequest = (data,params) => $.ajax({
    url: getTitterUrl()+'/sendComment?' + params,
    type: 'post',
    processData: false, // Не обрабатываем файлы (Don't process the files)
    contentType: false,
    dataType: 'json',
    data: data,
    xhrFields: {
        withCredentials: true
    },
});

export const sendDonateRequest = (data,params) => $.ajax({
    url:  '/requestDonate?' + params,
    type: 'post',
    processData: false, // Не обрабатываем файлы (Don't process the files)
    contentType: false,
    dataType: 'json',
    data: data,
    xhrFields: {
        withCredentials: true
    },
});

export const getBalanceRequest = () => $.ajax({
    url: getWebgoldUrl() + '/api/webgold/get_balance',
    type: "GET",
    xhrFields: {
        withCredentials: true
    },
    headers: {
        'X-Requested-With':"XMLHttpRequest"
    }
});

export const getAddFundsDataRequest = () => $.ajax({
    url: getWebgoldUrl() + '/add_funds_data',
    type: "GET",
    xhrFields: {
        withCredentials: true
    },
    headers: {
        'X-Requested-With':"XMLHttpRequest"
    }
});

export const getEthereumIdRequest = () => $.ajax({
    url: getWebgoldUrl() + '/api/webgold/get_wallet',
    type: "GET",
    xhrFields: {
        withCredentials: true
    },
    headers: {
        'X-Requested-With':"XMLHttpRequest"
    }
});


export const getUserEthereumId = (wrioID) => $.ajax({
    url: getWebgoldUrl() + `/api/webgold/get_user_wallet?wrioID=${wrioID}`,
    type: "GET",
    xhrFields: {
        withCredentials: true
    },
    headers: {
        'X-Requested-With':"XMLHttpRequest"
    }
});

export const freeWrgRequest = () => $.ajax({
    url: getWebgoldUrl() + '/api/webgold/free_wrg?amount=100',
    type: "GET",
    xhrFields: {
        withCredentials: true
    },
    headers: {
        'X-Requested-With':"XMLHttpRequest"
    }
});

export const txStatusRequest = (hash) => $.ajax({
    url: getWebgoldUrl() +`/api/webgold/tx_poll?txhash=${hash}`,
    type: "GET",
    xhrFields: {
        withCredentials: true
    },
    headers: {
        'X-Requested-With':"XMLHttpRequest"
    }
});
