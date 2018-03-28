/**
 * Created by michbil on 14.07.17.
 */

import React from "react";

export const scrollTop = () =>
  window.pageYOffset !== undefined
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
export function getElementDimensions(element) {
  if (!element) return null;
  var de = document.documentElement;
  var box = element.getBoundingClientRect();
  var top = box.top + window.pageYOffset - de.clientTop;
  var left = box.left + window.pageXOffset - de.clientLeft;
  return { top: top, left: left, height: box.height, width: box.width };
}

export const hasClass = (el, className) => {
  if (el.classList) return el.classList.contains(className);
  else
    return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
};

export const addClass = (el, className) => {
  if (el.classList) el.classList.add(className);
  else el.className += " " + className;
};

export const removeClass = (el, className) => {
  if (el.classList) el.classList.remove(className);
  else
    el.className = el.className.replace(
      new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
      " "
    );
};

export const pageEltHt = elt =>
  getElementDimensions(document.getElementsByClassName(elt)[0]).height;

export class StayOnTopElement extends React.Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.handleScroll();
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    var elem = this.refs.subcontainer;

    const sz1 = pageEltHt("page-header") - elem.offsetHeight;
    const sz2 = scrollTop() - elem.offsetHeight;
    //console.log(`${sz1} <= ${sz2}`);
    if (sz1 <= sz2) {
      addClass(elem, "navbar-fixed-top");
      addClass(elem, "col-sm-3");
    } else {
      removeClass(elem, "navbar-fixed-top");
      removeClass(elem, "col-sm-3");
    }
  }
}
