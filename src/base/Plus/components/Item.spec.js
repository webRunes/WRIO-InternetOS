import {expect} from 'chai';
import Item from './Item';
import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

const TEST_DATA = {
    active: true,
    name: 'test tab',
    url: 'webrunes.com'
};

describe('Item test', () => {
    it('should display item', () => {
        const data = TEST_DATA;
        const item = shallow(
            <Item data={data} del={()=>{}}/>
        );
        const p = item.find('a').nodes[1].props;
        expect(p.href).to.equal(data.url);
        //expect(item.refs.tab._attributes.href._nodeValue).to.equal(data.url);
    });
});
