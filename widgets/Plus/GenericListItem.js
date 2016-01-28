import React from 'react';
import normURL from './stores/normURL';
import {CrossStorageFactory} from './stores/CrossStorageFactory.js';

var storage = new CrossStorageFactory().getCrossStorage();

class GenericListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    modifyCurrentUrl(plus) {
        Object.keys(plus).forEach((item) => {
            if (normURL(item) === normURL(window.location.href)) {
                var _tmp = plus[item];
                _tmp.url = window.location.href;
                delete plus[item];
                plus[window.location.href] = _tmp;
            } else if (plus[item].children) {
                Object.keys(plus[item].children).forEach((child) => {
                    if (normURL(child) === normURL(window.location.href)) {
                        var _tmp = plus[item].children[child];
                        _tmp.url = window.location.href;
                        delete plus[item].children[child];
                        plus[item].children[window.location.href] = _tmp;
                    }
                });
            }
        });
        return plus;
    }

    async gotoUrl(e) {
        e.preventDefault();
        if (window.localStorage) {
            localStorage.setItem('tabScrollPosition', document.getElementById('tabScrollPosition').scrollTop);
        }
        try {
            await storage.onConnect();
            var plus = await storage.get('plus');
            if (!plus) {
                return;
            }
            plus = this.modifyCurrentUrl(plus);
            await storage.del('plus');
            await storage.set('plus', plus);
            await storage.del('plusActive');
            window.location = this.props.data.url;

        } catch (e) {
            console.log(e);
        }
    }

}

GenericListItem.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = GenericListItem;