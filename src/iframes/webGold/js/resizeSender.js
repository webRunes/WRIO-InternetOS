/**
 * Created by michbil on 23.10.16.
 */


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

window.frameReady = function() {
    var ht = $("#main").height();
    console.log("Webgold height",ht);
    parent.postMessage(JSON.stringify({"webgoldHeight":ht}), "*"); // signal that iframe is rendered and ready to go, so we can calculate it's actual height now
    return true;
};
