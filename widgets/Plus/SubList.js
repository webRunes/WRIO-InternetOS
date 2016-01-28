import React from 'react';
import actions from './actions/jsonld';
import Item from './Item';
import classNames from 'classnames';
import sortBy from 'lodash.sortby';
import some from 'lodash.some';
import normURL from './stores/normURL';
import {CrossStorageFactory} from './stores/CrossStorageFactory.js';
import GenericListItem from './GenericListItem';

var storage = new CrossStorageFactory().getCrossStorage();

class SubList extends GenericListItem {
    constructor(props){
        super(props);
        this.style = {
            overflow: 'hidden',
            height: ''
        };
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
        console.log('plus2', plus)
        return plus;
    }

    async gotoUrl(e) {
        console.log('gotoUrl called')
        var _storage = await storage.onConnect();
        console.log(_storage)
        try {
        var plus = await storage.get('plus');
        console.log('plus1', plus)
        } catch(err) {
            console.log(err)
        }
        if (!plus) {
            console.log('ololo')
            return;
        }
        plus = this.modifyCurrentUrl(plus);
        console.log('plus3', plus)
        await storage.del('plus');
        await storage.set('plus', plus);
        await storage.del('plusActive');
        window.location = this.props.data.url;
        e.preventDefault();
    }
*/
    createItem () {
        var children = this.props.data.children;
        return sortBy(
            Object.keys(children).map(function (name) {
                return children[name];
            }),
            'order'
        ).map(function (i) {
                var list = this.props.data.url,
                    del = function () {
                        actions.del(list, i.url);
                    };
                if (i.active) {
                    this.style.height = 'auto';
                }
                return <Item className="panel" del={del} data={i} key={i.url} />;
            }, this);
    }

    render() {
        this.style.height = this.props.data.active ? 'auto' : '0px';
        var data = this.props.data,
            name = data.name,
            children = data.children,
            childrenActive = some(children, function(i){
                return i.active;
            }),
            lis = this.createItem(),
            rightContent = children ? Object.keys(children).length : <span onClick={this.del} className="glyphicon glyphicon-remove" />,
            className = classNames({
                panel: true,
                active: data.active,
                open: (children && (data.active || childrenActive))
            });
        return (
            <li className={className}>
                <a href={this.props.data.url} onClick={this.gotoUrl.bind(this)} className="collapsed" data-parent="#nav-accordion" data-toggle="collapse">
                    <span className="qty pull-right">{rightContent}</span>
                    <span>{name}</span>
                </a>
                <div className="in" style={this.style}>
                    <ul className="nav nav-pills nav-stacked sub">
                        {lis}
                    </ul>
                </div>
            </li>
        );
    }
}

module.exports = SubList;