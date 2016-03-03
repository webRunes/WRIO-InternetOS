import React from 'react';
import Reflux from 'reflux';
import StoreLd from './stores/jsonld';
import actions from './actions/jsonld';
import ActionMenu from './actions/menu';
import StoreMenu from './stores/menu';
import classNames from 'classnames';
import List from './List';
import sortBy from 'lodash.sortby';
import P from './P';

class Plus extends React.Component {
    constructor(props) {
        super(props);
        this.onStateChange = this.onStateChange.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.state = {
            active: false,
            jsonld: {},
            fixed: false
        };
    }

    onStateChange(jsonld) {
        this.setState({
            jsonld: jsonld
        });
    }

    onToggleMenu(data, fixed) {
        this.setState({
            active: data,
            fixed: fixed
        });
    }

    componentWillMount() {
        this.listenStoreLd = StoreLd.listen(this.onStateChange);
        this.listenStoreMenuToggle = StoreMenu.listenTo(ActionMenu.toggleMenu, this.onToggleMenu);
        this.listenStoreMenuRefresh = StoreMenu.listenTo(ActionMenu.refresh, this.onRefresh);
        actions.read();
    }

    componentDidUpdate() {
        document.getElementById('tabScrollPosition')
            .scrollTop = Plus.checkActiveHeight(this.state.jsonld);
    }

    componentWillUnmount() {
        this.listenStoreLd();
    }

    onRefresh(){
        this.forceUpdate();
    }

    static checkActiveHeight(data) {
        if (Object.keys(data).length > 0) {
            return (Object.keys(data).map((name, i) => {
                    return (data[name].active == true) ? i : null;
                }).filter(Number)[0] + 1) * 40;
        } else {
            return 0;
        }
    }

    static checkActive(data) {
        var hasActive, childActive;
        if (data) {
            Object.keys(data).forEach((name) => {
                if (data[name].active) {
                    hasActive = true;
                } else {
                    if (data[name].children) {
                        var children = data[name].children;
                        Object.keys(children).forEach((childName) => {
                            if (children[childName].active) {
                                hasActive = true;
                            }
                        });
                    }
                }
            });
        }
        return !hasActive;
    }

    render() {
        var className, activePlus, height;

        if (this.state === null) {
            return null;
        }

        className = classNames({
            'navbar-collapse in unselectable': true,
            'active': this.state.active,
            'fixed': this.state.fixed
        });
        height = {
            'height': this.props.height || 'auto'
        };
        activePlus = Plus.checkActive(this.state.jsonld);

        return (
            <nav className={className} unselectable="on">
                <div className="navbar-header" id="tabScrollPosition" style={height}>
                    <List data={this.state.jsonld} height={this.props.height} />
                </div>
                <P data={{ name: 'plus' }} active={activePlus} />
            </nav>
        );
    }
}


Plus.propTypes = {
    height: React.PropTypes.node.isRequired
};


module.exports = Plus;
