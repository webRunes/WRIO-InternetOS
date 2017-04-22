/**
 * Created by michbil on 20.04.17.
 */


function rmTrailingHash(url) {
    let i = url.lastIndexOf('#');
    if (i < 0) {
        return url;
    }
    return url.substring(0,i);
}

export function sanitizePostUrl(url) {
    let posturl = rmTrailingHash(url);
    if (getFileName(posturl) == "") {
        posturl = posturl + "index.html";
    }
    return posturl;
}

function getFileName (posturl) {
    return posturl.substring(posturl.lastIndexOf('/')+1);

}