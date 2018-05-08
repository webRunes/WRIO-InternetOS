var cutTail = function(url) {
  var separators = ["?", "#"];
  separators.forEach(function(separator) {
    var separatorPosition = url.indexOf(separator);
    if (separatorPosition !== -1) {
      url = url.substring(0, separatorPosition);
    }
  });
  return url;
};

var cutIndexHtml = function(url) {
  return url.replace("/index.html", "");
};

var cutIndexHtm = function(url) {
  return url.replace("/index.htm", "");
};

var cutLastSlash = function(url) {
  return url.replace(/\/+$/, "");
};

const rules = [
  cutTail,
  cutIndexHtml,
  cutIndexHtm,
  cutLastSlash
];

export default function normURL(url) {
  return typeof url === "string" && url.length > 0
    ? rules.reduce((acc, rule) => rule(acc), url)
    : url
}

export function getPlusUrl(id) {
  return "https://wr.io/" + id + "/Plus-WRIO-App";
}

export function isPlusUrl(url, id) {
  const normalized = normURL(url);
  return normalized.search(getPlusUrl(id)) == 0;
}
