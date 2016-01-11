var mentions = require('./mentions');

module.exports = function(scripts) {
    var i,
        json,
        data = [];
    for (i = 0; i < scripts.length; i += 1) {
        if (scripts[i].type === 'application/ld+json') {
            json = undefined;
            try {
                json = JSON.parse(scripts[i].textContent);
            } catch (exception) {
                json = undefined;
                console.error('JSON-LD invalid: ' + exception);
            }
            if (typeof json === 'object') {
                data.push(json);
            }
        }
    }
    data.forEach(function(jsn) {
        mentions(jsn);
    });
    return data;
};
