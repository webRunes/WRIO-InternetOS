import React from "react";

export function NormailizeJSON(s) {
    // preserve newlines, etc - use valid JSON
    s = s.replace(/\\n/g, "\\n")  
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "\\t")
    .replace(/\\b/g, "\\b")
    .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    s = s.replace(/[\u0000-\u0019]+/g,"");
    return s;
}