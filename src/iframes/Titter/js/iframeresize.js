// Utility to send iframe height to the master frame

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

// handle event
window.addEventListener("optimizedResize", function() {
    frameReady();
});


window.frameReady = () => {
    var ht = $("#frame_container").outerHeight(true);
    console.log(ht);
    parent.postMessage(JSON.stringify({"titterHeight":ht}), "*"); // signal that iframe is renered and ready to go, so we can calculate it's actual height now
    return true;
};