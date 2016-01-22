var React = require('react'),
    Reflux = require('reflux'),
    actions = require('./actions/jsonld'),
    Item = require('./Item'),
    sortBy = require('lodash.sortby'),
    SubList = require('./SubList'),
    StoreMenu = require('./stores/menu'),
    ActionMenu = require('./actions/menu');

class List extends React.Component {
    constructor(props) {
        super(props);

        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.tabsSize = this.tabsSize.bind(this);
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
            fixed: (window.innerHeight < this.list().length * 40 + 93 && data) ? true : false
        });
    }

    onWindowResize(width, height) {
        this.setState({
            resize: true
        });
    }

    tabsSize(length) {
        this.setState({
            tabsSize: length
        });
    }

    list() {
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
                return <SubList data={item} key={item.url} />;
            }
            del = function() {
                actions.del(item.url);
            };
            return <Item className="panel" del={del} onClick={List.clickOnItem} data={item} listName={item.name} key={item.url} />;
        }, this);
    }

    componentDidMount() {
        this.listenStoreMenuToggle = StoreMenu.listenTo(ActionMenu.toggleMenu, this.onToggleMenu);
        this.listenStoreMenuWindowResize = StoreMenu.listenTo(ActionMenu.windowResize, this.onWindowResize);
        this.tabsSize(this.list().length);
    }

    shouldComponentUpdate(newProps) {
        if (newProps.height != 'auto') {
            if (this.list().length > 0) {

                return false;
            } else {
                ActionMenu.tabsSize(this.list().length * 40);
                return true;
            }
        } else {
            ActionMenu.tabsSize(this.list().length * 40);
            return true;
        }
    }

    render() {
        var height = {
            height: 'auto'
        };

        if (window.innerWidth < 767 && (this.state.fixed == true || window.innerHeight - 93 < this.list().length * 40)) {
            height = {
                height: window.innerHeight - 93
            };
        }

        return (
            <ul id="nav-accordion" className="nav navbar-var" style={height}>
                {this.list()}
            </ul>
        );
    }
}

List.propTypes = {
    data: React.PropTypes.object.isRequired,
    height: React.PropTypes.node.isRequired
};

module.exports = List;
