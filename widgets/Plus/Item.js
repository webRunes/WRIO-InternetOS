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
