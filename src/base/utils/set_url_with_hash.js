function setUrlWithHash(name: string) {
  window.history.pushState('page', 'params', window.location.pathname);
  window.location.hash = name;
}

module.exports = setUrlWithHash;
