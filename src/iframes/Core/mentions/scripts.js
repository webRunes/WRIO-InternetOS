import {check} from './mentions';

let scripts = (scripts)=> {
    let i,
        json,
        data = [];
    for (i = 0; i < scripts.length; i += 1) {
        if (scripts[i].type === 'application/ld+json') {
            json = undefined;
            try {
                json = JSON.parse(scripts[i].textContent);
            } catch (exception) {
                json = undefined;
                console.error('Invalid JSON-LD: ' + exception);
            }
            if (typeof json === 'object') {
                data.push(json);
            }
        }
    }
/*    data.forEach((jsn) => {
        check(jsn);
    });
*/    return data;
};

export {scripts};
