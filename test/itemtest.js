import {expect} from 'chai';
import Item from '../src/widgets/Plus/Item';
import {JSDOM} from 'jsdom';
require('./fakeDom');

import React from 'react';
import {renderIntoDocument, Simulate} from 'react-dom/test-utils';

const TEST_DATA = {
    active: true,
    name: 'test tab',
    url: 'webrunes.com'
};

describe('Item test', () => {
    it('should display item', () => {
        const data = TEST_DATA;
        const item = renderIntoDocument(
            <Item data={data} del={()=>{}}/>
        );
        console.log(item.refs);
        expect(item.refs.tab.textContent).to.equal(data.name);
        expect(item.refs.tab._attributes.href._nodeValue).to.equal(data.url);
    });
});
