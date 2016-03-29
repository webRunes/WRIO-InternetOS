var Reflux = require('reflux');

var menuAction = Reflux.createActions([
    'callAi',
    'logout',
    'fullScreen',
    'toggleMenu',
    'showSidebar',
    'tabsSize',
    'leftHeight',
    'windowResize',
    'refresh'
]);

module.exports = menuAction;