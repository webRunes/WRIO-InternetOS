const {expect} = require('chai');
const User = require('../src/client/js/components/User/index');
const jsdom = require('jsdom');

require('./fakeDom');

const React = require('react');
const {renderIntoDocument, Simulate} = require('react-addons-test-utils');

const TEST_DATA = {
    username: 'test',
    btcExchangeRate: 1,
    exchangeRate: 1
};

describe('User test', () => {
    it('should display user', () => {
        const data = TEST_DATA;
        const user = renderIntoDocument(
            <User username={data.username} btcExchangeRate={data.btcExchangeRate} exchangeRate={data.exchangeRate}/>
        );

        expect(user.refs.usdBalance.textContent).to.equal('... USD');
    });
});
