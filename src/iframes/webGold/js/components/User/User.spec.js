import User from  './index'
const React = require('react');

const renderer = require('react-test-renderer')

const TEST_DATA = {
    username: 'test',
    btcExchangeRate: 1,
    exchangeRate: 1
};

describe('User test', () => {
    it('should display user', () => {
        const data = TEST_DATA;
        const user = renderer.create(
            <User username={data.username} btcExchangeRate={data.btcExchangeRate} exchangeRate={data.exchangeRate}/>
        );

        //expect(user.refs.usdBalance.textContent).to.equal('... USD');
    });
});
