import {expect} from 'chai';
import CreateInfoTicket from '../src/core/components/CreateInfoTicket';

require('./fakeDom.js');


import React from 'react';
import {renderIntoDocument, Simulate} from 'react-dom/test-utils';

const TEST_DATA = {
    name: 'test',
    about: 'test'
};

describe('Item test', () => {
    it('should display item', () => {
        const data = TEST_DATA;
        const item = renderIntoDocument(
            <CreateInfoTicket  article={data} />
        );

        expect(item.refs.name.textContent).to.equal(data.name);
        expect(item.refs.about.textContent).to.equal(data.about);
    });
});
