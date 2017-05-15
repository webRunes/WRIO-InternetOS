import React from 'react';
import PlusActions from './actions/PlusActions.js';
import Item from './Item';
import classNames from 'classnames';
import sortBy from 'lodash.sortby';
import some from 'lodash.some';
import normURL from './utils/normURL';
import {CrossStorageFactory} from '../../core/store/CrossStorageFactory.js';
import GenericListItem from './GenericListItem';

var storage = CrossStorageFactory.getCrossStorage();

const childrenStyle = (active) => {
    const baseStyle = {
        overflow: 'hidden',
        height: ''
    };
    return Object.assign({},baseStyle,{height: active ? "auto": "0px"});
};

class SubList extends GenericListItem {
    constructor(props){
        super(props);
    }

    createItem () {
        var children = this.props.data.children;
        return sortBy(
            Object.keys(children).map(function (name) {
                return children[name];
            }),
            'order'
        ).map((i) => {
                const list = this.props.data.url;
                const del = () => PlusActions.del(list, i.url);
                return <Item className="panel" del={del} data={i} key={'sub'+encodeURIComponent(i.url)} child={true}/>;
            });
    }

    render() {

        var data = this.props.data,
            name = data.name || "Untitled",
            children = data.children,
            childrenActive = some(children, (i) => i.active),
            haveActiveChildren = (!!children && childrenActive),
            shouldOpen =  data.active || haveActiveChildren,
            list = this.createItem(),
            rightContent = children ? Object.keys(children).length : <span onClick={this.del} className="glyphicon glyphicon-remove" />,
            className = classNames({
                panel: true,
                group: true,
                active: shouldOpen,
                open: shouldOpen
            });

        return (
            <li className={className}>
                <a href={this.props.data.url} onClick={this.gotoUrl.bind(this)}
                   className={shouldOpen ? "collapsed active" : "collapsed"} data-parent="#nav-accordion" data-toggle="collapse">
                    <span className="qty pull-right">{rightContent}</span>
                    <span>{name}</span>
                </a>
                <div className="in" style={childrenStyle(shouldOpen)}>
                    <ul className="nav nav-pills nav-stacked sub">
                        {list}
                    </ul>
                </div>
            </li>
        );
    }
}

module.exports = SubList;