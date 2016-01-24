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

    componentDidMount() {
        this.listenStoreLd = StoreLd.listen(this.onStateChange);
        this.listenStoreMenuToggle = StoreMenu.listenTo(ActionMenu.toggleMenu, this.onToggleMenu);
        actions.read();
    }

    componentDidUpdate() {
        document.getElementById('tabScrollPosition')
            .scrollTop = Plus.checkActiveHeight(this.state.jsonld);
    }

    componentWillUnmount() {
        this.listenStoreLd();
    }

    static checkActiveHeight(data) {
        if (Object.keys(data).length > 0) {
            return (Object.keys(data)
                .map(function(name, i) {
                    return (data[name].active == true) ? i : null;
                }, this)
                .filter(Number)[0] + 1) * 40;
        } else {
            return 0;
        }
    }

    static checkActive(data) {
        var top, childActive;
        if (data) {
            top = Object.keys(data).filter(function(name) {
                if(data[name].active == true){
                    return true;
                }else{
                    if(data[name].children){
                        var children = data[name].children;
                        childActive = Object.keys(children).filter(function(childName){
                            return children[childName].active == true;
                        });
                        return top ? !(top.length == 1) : false;
                    } else {
                        return false;
                    }
                }
            }, this);

            return !(top.length == 1);
        } else {
            return false;
        }
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
