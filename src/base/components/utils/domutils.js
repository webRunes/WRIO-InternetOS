/**
 * Created by michbil on 14.07.17.
 */

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