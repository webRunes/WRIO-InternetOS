/**
 * Created by Victor on 09.11.2015.
 */
import React from 'react';
import ActionMenu from '../../../widgets/Plus/actions/menu';


var oldHeight = 0;
var oldWidth = 0;

(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                // For IE compatibility
                var evt = document.createEvent("CustomEvent");
                evt.initCustomEvent(name, false, false, {
                    'cmd': "resize"
                });
                obj.dispatchEvent(evt);
                // obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();


window.addEventListener('optimizedResize',() => {
    var w = window.innerWidth;
    var h = window.innerHeight;

    if ((w != oldWidth) || (h!=oldHeight)) {
        ActionMenu.windowResize(w,h);
    }
    oldHeight = h;
    oldWidth = w;
});
