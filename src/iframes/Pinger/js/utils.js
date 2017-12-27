/**
 * Created by michbil on 05.03.17.
 */

// Return cookie as "name". "undefined" is a default name
export function getCookie(name) {
  var matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

window.goAddFunds = () => {
  parent.postMessage(JSON.stringify({ goAddFunds: true }), "*");
};
export function loadDraft() {
  if (window.localStorage["draft"]) {
    const title = window.localStorage["draft_title"];
    const text = window.localStorage["draft"];
    window.localStorage.removeItem("draft_title");
    window.localStorage.removeItem("draft");
    return [title, text];
  } else {
    return ["", ""];
  }
}

export function saveDraft(title, text) {
  window.localStorage["draft"] = text;
  window.localStorage["draft_title"] = title;
}

export const delay = time =>
  new Promise((resolve, reject) => setTimeout(resolve, time));
