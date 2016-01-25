import {expect} from 'chai';
import Item from '../widgets/Plus/Item';
import jsdom from 'jsdom';

var FAKE_DOM_HTML = `
<html>
<body>
</body>
</html>
`;

function setupFakeDOM() {
    if (typeof document !== 'undefined') {
        return;
    }

    global.document = jsdom.jsdom(FAKE_DOM_HTML);
    global.window = document.defaultView;
    global.navigator = window.navigator;
}

setupFakeDOM();

import React from 'react';
import {renderIntoDocument, Simulate} from 'react-addons-test-utils';

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

        expect(item.refs.tab.textContent).to.equal(data.name);
        expect(item.refs.tab._attributes.href._nodeValue).to.equal(data.url);
    });
});
