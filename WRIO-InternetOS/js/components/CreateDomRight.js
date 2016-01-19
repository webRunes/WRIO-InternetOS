var React = require('react'),
    ReactDOM = require('react-dom'),
    UrlMixin = require('../mixins/UrlMixin'),
    classNames = require('classnames'),
    ActionMenu = require('../../../Plus-WRIO-App/actions/menu'),
    CreateInfoTicket = require('./CreateInfoTicket'),
    CreateControlButtons = require('./CreateControlButtons'),
    StoreMenu = require('../../../Plus-WRIO-App/stores/menu'),
    Reflux = require('reflux'),
    _ = require('lodash'),
    center = require('../actions/center');

var External = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        active: React.PropTypes.func.isRequired,
        isActive: React.PropTypes.bool.isRequired
    },
    onClick: function(e) {
        center.external(this.props.data.url, this.props.data.name);
        ActionMenu.showSidebar(false);
        this.props.active(this);
        e.preventDefault();
    },
    getInitialState: function() {
        return {
            active: false
        };
    },
    componentWillMount: function() {
        if (this.props.isActive) {
            this.props.active(this);
        }
        center.external(this.props.data.url, this.props.data.name, true, (url) => {
            this.setState({
                url: url
            });
        });
    },
    render: function() {
        var o = this.props.data,
            className = this.state.active ? 'active' : '';
        return (
            <li className={className}>
                <a href={this.state.url} onClick={this.onClick}>{o.name}</a>
            </li>
        );
    }
});

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        active: React.PropTypes.func.isRequired,
        isActive: React.PropTypes.bool.isRequired
    },
    onClick: function(e) {
        center.article(this.props.data.name);
        ActionMenu.showSidebar(false);
        this.props.active(this);
        e.preventDefault();
    },
    getInitialState: function() {
        return {
            active: false
        };
    },
    componentWillMount: function() {
        if (this.props.isActive) {
            this.props.active(this);
        }
        center.article(this.props.data.name, true, (url) => {
            this.setState({
                url: url
            });
        });
    },
    render: function() {
        var o = this.props.data,
            className = this.state.active ? 'active' : '';
        return (
            <li className={className}>
                <a href={this.state.url} onClick={this.onClick} className={o.class}>{o.name}</a>
            </li>
        );
    }
});

var Cover = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        active: React.PropTypes.func.isRequired,
        isActive: React.PropTypes.bool.isRequired
    },
    onClick: function(e) {
        center.cover(this.props.data.url);
        ActionMenu.showSidebar(false);
        this.props.active(this);
        e.preventDefault();
    },
    getInitialState: function() {
        return {
            active: false
        };
    },
    componentWillMount: function() {
        if (this.props.isActive) {
            this.props.active(this);
        }
        center.cover(this.props.data.url, null, true, (url) => {
            this.setState({
                url: url
            });
        });
    },
    render: function() {
        var o = this.props.data,
            className = this.state.active ? 'active' : '';
        return (
            <li className={className}>
                <a href={this.state.url} onClick={this.onClick}>{o.name}</a>
            </li>
        );
    }
});

var CreateDomRight = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },

    mixins: [UrlMixin],

    active: function(child) {
        if (this.current) {
            this.current.setState({
                active: false
            });
        }
        this.current = child;
        this.current.setState({
            active: true
        });
    },

    getInitialState: function() {
        return {
            active: false,
            resize: false,
            article: {},
            author: {}
        };
    },

    componentDidMount: function() {
        this.listenStoreMenuSidebar = StoreMenu.listenTo(ActionMenu.showSidebar, this.onShowSidebar);
        this.listenStoreMenuWindowResize = StoreMenu.listenTo(ActionMenu.windowResize, this.onWindowResize);
    },

    componentWillMount: function() {
        this.props.data.forEach((o) => {
            if (o['@type'] === 'Article') {
                this.state.article = o;
                if (o.author) {
                    var regexp = o.author.match(/(.*)\?wr.io=([0-9]+)$/);
                    this.setState({
                        author: {
                            id: regexp[2],
                            url: regexp[1]
                        }
                    });
                }
            }
        });
    },

    onShowSidebar: function(data) {
        this.setState({
            active: data
        });
    },

    onWindowResize: function(width, height) {
        if (width > 767) {
            if (height < ReactDOM.findDOMNode(this.refs.sidebar)
                .offsetHeight) {
                this.setState({
                    resize: true
                });
            }
        } else {
            this.setState({
                resize: true
            });
        }
    },

    componentWillUnmount: function() {
        this.listenStoreMenuSidebar();
        this.listenStoreMenuWindowResize();
    },

    render: function() {
        var type = this.searchToObject()
            .list,
            isActive,
            isActiveFirstArticle = true,
            items = [],
            isCover = function(o) {
                return o.url && (typeof o.url === 'string') && (o.url.indexOf('?cover') === o.url.length - 6); // TODO: maybe regexp woud be better, huh?
            },
            className = classNames({
                'col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas': true,
                'active': this.state.active
            }),
            height;

        var listParam = this.searchToObject()
            .list;

        if (listParam) {
            if (listParam.toLowerCase() == 'cover') {
                isActiveFirstArticle = false; // if we have ?list=cover parameter in command line, don't highlight first article
            }
        }


        this.props.data.forEach(function add(o) {
            if (o['@type'] === 'Article' || _.chain(o.itemListElement)
                .pluck('@type')
                .contains('Article')
                .value()) {
                isActive = o.name === window.location.hash.substring(1) || isActiveFirstArticle;
                isActiveFirstArticle = false;
                items.push(<Article data={o} key={items.length} active={this.active} isActive={isActive} />);
            } else if (o['@type'] === 'ItemList') {
                var isContainItemList = _.chain(o.itemListElement)
                    .pluck('@type')
                    .contains('ItemList')
                    .value();
                if (!isContainItemList) {
                    isActive = (type === o.name) || this.props.data.length === 1;
                    if (isCover(o)) {
                        if (type === o.name) {
                            center.cover(o.itemListElement[0].url, false);
                            items.push(<Cover data={o} key={items.length} active={this.active} isActive={true} />);
                        } else {
                            items.push(<Cover data={o} key={items.length} active={this.active} isActive={false} />);
                        }
                    } else {
                        if (type === o.name) {
                            center.external(o.url, o.name);
                        }
                        items.push(<External data={o} key={items.length} active={this.active} isActive={isActive} />);
                    }
                } else {
                    o.itemListElement.forEach(function(item) {
                        if (isCover(item)) {
                            isActive = type === item.name;
                            if (type === o.name) {
                                center.cover(o.url, false);
                                items.push(<Cover data={o} key={items.length} active={this.active} isActive={isActive} />);
                            } else {
                                center.cover(o.itemListElement[0].url, true);
                                items.push(<Cover data={item} key={items.length} active={this.active} isActive={isActive} />);
                            }
                        } else {
                            isActive = type === item.name;
                            if (isActive) {
                                center.external(item.url, item.name);
                            }
                            items.push(<External data={item} key={items.length} active={this.active} isActive={isActive} />);
                        }
                    }, this);
                }
            }
            if (o.hasPart) {
                o.hasPart.forEach(add, this);
            }
        }, this);

        if (window.innerWidth > 767) {
            height = {
                height: 'auto'
            };
        } else {
            height = {
                height: window.innerHeight - 52
            };
        }
        return (
            <div className={className} id="sidebar">
                <div ref="sidebar" className="sidebar-margin">
                    {this.state.article ? <aside>
                        <CreateInfoTicket article={this.state.article} author={this.state.author} />
                    </aside> : ''}
                    {this.state.article ? <CreateControlButtons article={this.state.article} author={this.state.author} /> : null}
                    <ul className="nav nav-pills nav-stacked" style={height}>
                        {items}
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = CreateDomRight;
