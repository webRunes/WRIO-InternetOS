const STORAGE_DOMAIN = 'wr.io';

export function extractFileName(pathname) {
  const fileName = pathname.match(/\/[0-9]+\/(.*)/);
  let out;
  if (fileName) {
    out = fileName[1];
    if (out === '' || !out) {
      out = 'index.html'; // if no file specified, let's assume this is index.htm
    }
    return out;
  }
}

export function parseUrl(href) {
  const match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
  return (
    match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

export function appendIndex(url) {
  const parsedUrl = parseUrl(url);
  const posturl = parsedUrl.pathname;
  const filename = posturl.substring(posturl.lastIndexOf('/') + 1);
  if (filename == '') {
    return `${url}index.html`;
  }
  return url;
}

export function formatAuthor(id) {
  return id ? `https://wr.io/${id}/?wr.io=${id}` : 'unknown';
}

function extractEditUrl() {
  const editUrl = window.location.search.match(/\?article=([\.0-9a-zA-Z_%:\/?]*)/);
  if (editUrl) {
    return appendIndex(decodeURIComponent(editUrl[1]));
  }
}

function getFilename(editUrl) {
  const editUrlParsed = parseUrl(editUrl);
  if (editUrlParsed && editUrlParsed.host === STORAGE_DOMAIN) {
    return extractFileName(editUrlParsed.pathname);
  }
}

export function parseEditingUrl() {
  const editUrl = extractEditUrl();
  if (editUrl) {
    return [editUrl, getFilename(editUrl)];

    console.log('Page edit link received', editUrl);
  }
  return [null, null];
}

export const CREATE_MODE =
  window.location.pathname === '/create' || window.location.pathname === '/create_list';

export const ValidURL = function ValidURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(str);
};
