/**
 * Created by michbil on 02.06.17.
 */
import {JSDOM} from 'jsdom';


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
    var jsd =  new JSDOM(FAKE_DOM_HTML);
    global.window = jsd;
    global.document = jsd.window.document;
}
setupFakeDOM();