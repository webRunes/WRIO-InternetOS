import React from 'react';
import classNames from 'classnames';
import normURL from './stores/normURL';
import {CrossStorageFactory} from './stores/CrossStorageFactory.js';
import GenericListItem from './GenericListItem';

var storage = new CrossStorageFactory().getCrossStorage();

class Item extends GenericListItem {
    constructor(props) {
        super(props);
    }

/*    modifyCurrentUrl(plus) {
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
        if (window.localStorage) {
            localStorage.setItem('tabScrollPosition', document.getElementById('tabScrollPosition').scrollTop);
        }
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
        e.preventDefault();
    }
*/
    render() {
        var className = classNames({
                active: this.props.data ? this.props.data.active : false,
                panel: true
            }),
            data = this.props.data,
            name = data.name;
        return (
            <li tabIndex="1" className={className}>
                <a onClick={this.props.del} className="pull-right">
                    <span className="glyphicon glyphicon-remove" />
                </a>
                <a href={this.props.data.url} ref="tab" onClick={this.gotoUrl.bind(this)}>{name}</a>
            </li>
        );
    }
}

Item.propTypes = {
    del: React.PropTypes.func.isRequired
};

module.exports = Item;
