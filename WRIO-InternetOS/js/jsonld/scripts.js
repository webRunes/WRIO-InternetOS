var mentions = require('./mentions');

module.exports = function (scripts) {
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
                console.error('Your json-ld not valid: ' + exception);
            }
            if (typeof json === 'object') {
                data.push(json);
            }
        }
    }
    data.forEach(function (jsonData) {
        mentions(jsonData);
    });
    return data;
};
