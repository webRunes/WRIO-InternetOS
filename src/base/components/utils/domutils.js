/**
 * Created by michbil on 14.07.17.
 */

import React from 'react'

export const scrollTop = () => (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
export function getElementOffset(element)
{
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top + window.pageYOffset - de.clientTop;
    var left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left , height: box.height };
}

export const hasClass = (el, className) => {
    if (el.classList)
        return el.classList.contains(className);
    else
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
};

export const addClass = (el, className) => {
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
};

export const removeClass = (el,className) => {
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

export class StayOnTopElement extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
    }
    componentDidUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        var elem = this.refs.subcontainer;
        const windowHt = document.body.clientHeight;

        if (!elem.getAttribute('data-top')) {
            if (hasClass(elem,'navbar-fixed-top'))
                return;
            var offset = getElementOffset(elem);
            elem.setAttribute('data-top', windowHt);
        }
        const sz1 = elem.getAttribute('data-top') - elem.offsetHeight ;
        const sz2 = scrollTop() - elem.offsetHeight;
        //console.log(`${sz1} <= ${sz2}`);
        if (sz1 <= sz2) {
            addClass(elem,'navbar-fixed-top');
            addClass(elem,'col-sm-3');
        }
        else {
            removeClass(elem,'navbar-fixed-top');
            removeClass(elem,'col-sm-3');
        }
    }

}