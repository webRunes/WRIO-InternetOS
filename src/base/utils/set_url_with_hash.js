import * as global from '../global';

function setUrlWithHash(name: string, tabName: string) {
  window.history.pushState('page', 'params', window.location.pathname);
  console.log("name=====>" + name);
  console.log(global.tabKey);
  if (((global.tabKey == "deviceProfile") || (global.tabKey == "feed") ||
    (global.tabKey == "dashboard")) && (name != "#dashboard") && (name != "#deviceProfile") && (name != "#feed")) {
    window.location.hash = name;
    location.reload();
  } else {
    console.log("else===>")
    window.location.hash = name;
    console.log(window.location.hash);
  }
}
module.exports = setUrlWithHash;