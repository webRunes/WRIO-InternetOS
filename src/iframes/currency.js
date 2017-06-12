/**
 * Created by michbil on 25.10.16.
 */
const BigNumber = require('bignumber.js');
const Const = require('./constant.js');
const nconf = require('nconf');

const SATOSHI = Const.SATOSHI;

let instance = null;

class CurrencyConverter {

    constructor(grammPrice) {
        if(!instance){
            instance = this;
            this._constructor(grammPrice);
        }
        return instance;
    }

    _constructor (grammPrice) {
        if (typeof window === 'undefined') {
            const rate = nconf.get('payment:grammPriceUSD');
            this.presalePrice = nconf.get('payment:presaleBTCPrice');
            if (!rate) {
                throw new Error("Cannot get rate from config!");
            }
            console.log("RATE", rate);
            this.grammPriceUSD = new BigNumber(rate);
            //  1000 WRG = 1g of gold (grammPriceUSD)
            console.log(`Wrg exchange ${Const.WRG_UNIT} WRG = ${this.grammPriceUSD.toString()} USD`);
        } else {
            if (!grammPrice) {
                throw new Error("Price of 1g of gold not specified!");
            }
            this.grammPriceUSD = grammPrice;
        }
    }

    /**
     * Converts WRG value to usd
     * @param amount as number
     * @returns {fixed point USD amount}
     */
    wrgToUSD(amount) {
        const gramsOfGold = new BigNumber(amount).div(Const.WRG_UNIT);
        return gramsOfGold.mul(this.grammPriceUSD).toFixed();
    }

    /**
     * Returns USD-BTC rate
     * @param grammPrice - price of 1g of gold
     * @param bitcoinToUsd - bitcoin to USD rate
     * @returns {rate, can be passed to convertBTCtoWRG etc}
     */

    getRate(grammPrice,bitcoinToUsd) {
        return bitcoinToUsd.times(Const.WRG_UNIT).div(grammPrice);
    }

    /**
     *  same as getRate, but gets grammPrice from the config
     * @param bitcoinToUsd
     * @returns {*}
     */

    getRateDefault(bitcoinToUsd) {
        return this.getRate(this.grammPriceUSD, bitcoinToUsd);
    }

    /**
     *  Converts bitcoin to WRG based on price of 1g of gold in USD and bitcoin-USD rate
     * @param btc - bitcoin value, in satoshis
     * @param bitcoinToUSD - bitcoin to USD rate,
     * @returns {WRG}
     */

    convertBTCtoWRG(btc,btcWrgRate) {
        return btc.mul(btcWrgRate).div(SATOSHI);
    }


    /**
     * WRG to BTC based on price of 1g of gold in USD and bitcoin-USD rate
     * @param wrg - number of WRG
     * @param bitcoinToUSD - rate in USD
     * @returns {number of bitcoins, in satoshi}
     */

    convertWRGtoBTC(wrg,btcWrgRate) {
        const btc = wrg.div(btcWrgRate);
        return btc.times(SATOSHI);
    }

    /**
     *
     * @param satoshis - integer number, btc value in satoshis
     * @returns {WRG}
     */

    satoshiToWRGUsingPresalePrice(satoshis) {
        const price = new BigNumber(this.presalePrice);
        return this.convertBTCtoWRG(new BigNumber(satoshis),price).toFixed(2);
    }

    /**
     * convert satoshi to milliWRG(minimum wrg value)
     * @param satoshis
     * @returns {*}
     */

    satoshiTomilliWRGUsingPresalePrice(satoshis) {
        const price = new BigNumber(this.presalePrice);
        return this.convertBTCtoWRG(new BigNumber(satoshis),price).mul(100).toFixed(0);
    }

}

module.exports = CurrencyConverter;
