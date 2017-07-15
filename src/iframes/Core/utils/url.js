
const STORAGE_DOMAIN = "wr.io";

export function extractFileName(pathname) {
    var fileName = pathname.match(/\/[0-9]+\/(.*)/);
    var out;
    if (fileName) {
        out = fileName[1];
        if (out === "" || !out) {
            out = "index.html"; // if no file specified, let's assume this is index.htm
        }
        return out;
    }
}

export function parseUrl(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
            protocol: match[1],
            host: match[2],
            hostname: match[3],
            port: match[4],
            pathname: match[5],
            search: match[6],
            hash: match[7]
        };
}

export function appendIndex(url) {
    var parsedUrl = parseUrl(url);
    var posturl = parsedUrl.pathname;
    var filename = posturl.substring(posturl.lastIndexOf('/')+1);
    if (filename == "") {
        return url + "index.html";
    }
    return url;
}

export function formatAuthor(id) {
    return id ? `https://wr.io/${id}/?wr.io=${id}` : 'unknown';
}

function extractEditUrl() {
    let editUrl = window.location.search.match(/\?article=([\.0-9a-zA-Z_%:\/?]*)/);
    if (editUrl) {
        return appendIndex(decodeURIComponent(editUrl[1]));
    }
}

function getFilename(editUrl) {
    let editUrlParsed = parseUrl(editUrl);
    if (editUrlParsed && editUrlParsed.host == STORAGE_DOMAIN) {
        return extractFileName(editUrlParsed.pathname);
    }
}

export function parseEditingUrl() {
    const editUrl = extractEditUrl();
    if (editUrl) {
        return [editUrl, getFilename(editUrl)];

        console.log("Page edit link received", editUrl);

    }
    return [null,null];
}