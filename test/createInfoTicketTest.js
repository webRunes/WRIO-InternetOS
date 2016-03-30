import {expect} from 'chai';
import CreateInfoTicket from '../src/core/components/CreateInfoTicket';
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
