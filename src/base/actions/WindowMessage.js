/**
 * Created by michbil on 26.01.16.
 */

import Reflux from "reflux";
import { getServiceUrl, getDomain } from "../servicelocator.js";
import Rx from "rxjs";

var domain = getDomain();

const debugMessages = false;

function parseMessage(e) {
  const message = e.data;
  if (debugMessages) {
    console.log("WINDOW MESSAGE++++++++++++++++++++++++++", e.data);
  }
  try {
    return JSON.parse(message);
  } catch (e) {
    return null;
  }
}

function checkForService(name, e) {
  var httpChecker = new RegExp("^(http|https)://" + name + "." + domain, "i");
  return httpChecker.test(e.origin);
}

window.addEventListener("message", messageListener);

export const loginMessage = new Rx.BehaviorSubject();
export const forceIframeReload = new Rx.BehaviorSubject(false);

const titterMessage = new Rx.BehaviorSubject();
const webgoldMessage = new Rx.BehaviorSubject();

/* Modify stream of heights, extract pixels, debounce and distinct it */
export const getHeight = (name, subject) =>
  subject
    .filter(msg => !!msg && !!msg[name])
    .map(msg => msg[name])
    .distinct()
    .debounceTime(500);

export const titterHeight = getHeight("titterHeight", titterMessage);
export const webgoldHeight = getHeight("webgoldHeight", webgoldMessage);
export const transactionsHeight = getHeight(
  "transactionsHeight",
  webgoldMessage
);

console.log("Initialize RX subjects");

const requestReload = () => location.reload();
const requestIframeReload = () => forceIframeReload.next(true);

function messageListener(e) {
  const msg = parseMessage(e);
  if (msg === null) {
    return;
  }

  if (checkForService("titter", e) || checkForService("titter_d", e)) {
    if (msg.reload) {
      return requestReload();
    }
    titterMessage.next(msg);
  }
  if (checkForService("login", e)) {
    if (msg.login === "success") {
      console.log("Requesting page reload");
      document
        .getElementById("loginbuttoniframe")
        .contentWindow.postMessage("reload", getServiceUrl("login"));
      requestIframeReload();
    }

    if (msg.profile) {
      loginMessage.next(msg); // leave only one profile message
      document
        .getElementById("loginbuttoniframe")
        .contentWindow.postMessage("ack", getServiceUrl("login"));
    } else {
      loginMessage.next(msg); // leave only one profile message
    }
  }

  if (checkForService("webgold", e)) {
    if (msg.reload) {
      return requestReload();
    }
    webGoldMessage.next(msg);
  }
}
