import React from 'react';
import Reflux from 'reflux';
import PlusActions from './actions/PlusActions.js';
import Item from './Item';
import sortBy from 'lodash.sortby';
import SubList from './SubList';
import StoreMenu from './stores/menu';
import ActionMenu from './actions/menu';

class List extends React.Component {
    constructor(props) {
        super(props);

        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.state = {
            fixed: false,
            resize: false,
            tabsSize: true
        };
    }

    static clickOnItem() {
        ActionMenu.toggleMenu(false);
    }

    onToggleMenu(data, fixed) {
        this.setState({
            fixed: (window.innerHeight < this.getList().length * 40 + 93 && data) ? true : false
        });
    }

    getList() {
        var del;
        return sortBy(
            Object.keys(this.props.data).map((name) => {
                return this.props.data[name];
            }, this), 'order'
        ).filter((item) => {
            if (typeof item === 'object') {
                return item;
            }
        }).map((item, i) => {
            if (item.children) {
                return <SubList data={item} key={'s'+encodeURIComponent(item.url)} />;
            }
            del = function() {
                PlusActions.del(item.url);
            };
            return <Item className="panel" del={del} onClick={List.clickOnItem} data={item} listName={item.name} key={encodeURIComponent(item.url)} />;
        }, this);
    }

    componentDidMount() {
        this.listenStoreMenuToggle = StoreMenu.listenTo(ActionMenu.toggleMenu, this.onToggleMenu);
    }

    render() {
        var height = {
            height: "auto"
        };
        return (
            <ul id="nav-accordion" className="nav navbar-var" style={height}>
                {this.getList()}
            </ul>
        );
    }
}

List.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = List;
