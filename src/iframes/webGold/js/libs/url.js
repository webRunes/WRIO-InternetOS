/**
 * Created by michbil on 30.03.17.
 */

export default function extractUrlParameter(val) {
    var result = "Not found",
        tmp = [];
    location.search
        //.replace ( "?", "" )
        // this is better, there might be a question mark inside
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
        });
    return result;
}