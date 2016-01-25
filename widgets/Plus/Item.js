import React from 'react';
import classNames from 'classnames';
import normURL from './stores/normURL';
import {CrossStorageFactory} from './stores/CrossStorageFactory.js';

var storage = new CrossStorageFactory().getCrossStorage();

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.gotoUrl = this.gotoUrl.bind(this);
    }
    gotoUrl(e) {
        if (window.localStorage) {
            localStorage.setItem('tabScrollPosition', document.getElementById('tabScrollPosition').scrollTop);
        }
        storage.onConnect()
            .then(() =>{
                return storage.get('plus');
            })
            .then((plus) => {
                if (plus) {
                    Object.keys(plus).forEach((item, i) => {
                        if (normURL(item) === normURL(window.location.href)) {
                            var _tmp = plus[item];
                            _tmp.url = window.location.href;
                            delete plus[item];
                            plus[window.location.href] = _tmp;
                        }
                    });
                    storage.del('plus');
                    storage.set('plus', plus);
                    window.location = this.props.data.url;
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
        e.preventDefault();
    }
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
                <a href={this.props.data.url} ref="tab" onClick={this.gotoUrl}>{name}</a>
            </li>
        );
    }
}

Item.propTypes = {
    data: React.PropTypes.object.isRequired,
    del: React.PropTypes.func.isRequired
};

module.exports = Item;
