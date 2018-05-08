const UrlMixin = {
  getUrlParams() {
    return window.location.search.substring(1);
  },

  getAliasByType(type) {
    return {
      cover: "Cover",
      external: "Blog"
    }[type];
  },

  searchToObject(url) {
    if (url) {
      url = this.parseUrl(url).search;
    } else {
      throw new Error("Search to object without parameter is deprecated!!");
    }
    var pairs = url.substring(1).split("&"),
      obj = {};

    for (var i in pairs) {
      if (pairs[i] === "") {
        continue;
      }
      var pair = pairs[i].split("=");
      obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return obj;
  },

  parseUrl(url) {
    var parser = document.createElement("a");
    parser.href = url;
    return parser;
  },

  collectUrl(parsedUrl) {
    return parsedUrl.href;
  },

  getCurrentProtocol() {
    return window.location.protocol;
  },

fixUrlProtocol(url) {
    if (!url) {
      return;
    } else if (location.origin === 'file://') {
      return url;
    }
    var separatorPosition = url.indexOf("//");
    if (separatorPosition !== -1) {
      url = url.substring(separatorPosition + 2, url.length);
    }
    return "//" + url;
  },

  compareProfileUrls(url1, url2) {
    var url1P = this.parseUrl(url1);
    var url2P = this.parseUrl(url2);
    // compare hosts and paths, ignore search
    if (url1P.host === url2P.host && url1P.pathname == url2P.pathname) {
      return true;
    }
    return false;
  },

  replaceSpaces(str: string): string {
    if (typeof str === "string") {
      return str.replace(/ /g, "_");
    } else {
      return str;
    }
  },

  formatUrl(url: string): string {
    var splittedUrl = url.split("://");
    var host;
    var path;
    if (splittedUrl.length == 2) {
      host = splittedUrl[0];
      path = splittedUrl[1];
    } else {
      host = "http";
      path = url;
    }

    var splittedPath = path.split("/");
    var lastNode = splittedPath[splittedPath.length - 1];
    if (splittedPath.length > 1 && lastNode) {
      if (!endsWith(lastNode, ".htm") && !endsWith(lastNode, ".html")) {
        path += "/";
      }
    } else if (splittedPath.length == 1) {
      path += "/";
    }
    var resultUrl = host + "://" + path;

    return resultUrl;
  }
};

module.exports = UrlMixin;
