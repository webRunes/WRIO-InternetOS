var React = require('react'),
    UrlMixin = require('../mixins/UrlMixin'),
    classNames = require('classnames'),
    ActionMenu = require('plus/js/actions/menu'),
    StoreMenu = require('plus/js/stores/menu'),
    Reflux = require('reflux'),
    _ = require('lodash'),
    center = require('../actions/center');

var External = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        active: React.PropTypes.func.isRequired,
        isActive: React.PropTypes.bool.isRequired
    },
    onClick: function () {
        center.external(this.props.data.url, this.props.data.name);
        ActionMenu.showSidebar(false);
        this.props.active(this);
    },
    getInitialState: function () {
        return {
            active: false
        };
    },
    componentWillMount: function() {
        if(this.props.isActive) {
            this.props.active(this);
        }
    },
    render: function () {
        var o = this.props.data,
            className = this.state.active ? 'active' : '';
        return (
            <li className={className}>
                <a onClick={this.onClick}>{o.name}</a>
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
    onClick: function () {
        center.article(this.props.data.name);
        ActionMenu.showSidebar(false);
        this.props.active(this);
    },
    getInitialState: function () {
        return {
            active: false
        };
    },
    componentWillMount: function() {
        if(this.props.isActive) {
            this.props.active(this);
        }
    },
    render: function () {
        var o = this.props.data,
            className = this.state.active ? 'active' : '';
        return (
            <li className={className}>
                <a onClick={this.onClick} className={o.class}>{o.name}</a>
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
    onClick: function () {
        center.cover(this.props.data.url);
        ActionMenu.showSidebar(false);
        this.props.active(this);
    },
    getInitialState: function () {
        return {
            active: false
        };
    },
    componentWillMount: function() {
        if(this.props.isActive) {
            this.props.active(this);
        }
    },
    render: function () {
        var o = this.props.data,
            className = this.state.active ? 'active' : '';
        return (
            <li className={className}>
                <a onClick={this.onClick}>{o.name}</a>
            </li>
        );
    }
});

var CreateDomRight = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },

    mixins: [UrlMixin],

    active: function (child) {
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
            resize: false
        };
    },

    componentDidMount: function (){
        this.listenStoreMenuSidebar = StoreMenu.listenTo(ActionMenu.showSidebar, this.onShowSidebar);
        this.listenStoreMenuWindowResize = StoreMenu.listenTo(ActionMenu.windowResize, this.onWindowResize);
    },

    onShowSidebar: function (data) {
        this.setState({
            active: data
        });
    },

    onWindowResize: function (width, height) {
        if(width > 767){
            if(height < React.findDOMNode(this.refs.sidebar).offsetHeight){
                this.setState({
                    resize: true
                });
            }
        }else{
            this.setState({
                resize: true
            });
        }
    },

    componentWillUnmount: function () {
        this.listenStoreMenuSidebar();
        this.listenStoreMenuWindowResize();
    },

    render: function () {
        var type = this.searchToObject().list,
            isActive,
            isActiveFirstArticle = true,
            items = [],
            isCover = function (o) {
                return o.url && (typeof o.url === 'string') && (o.url.indexOf('?cover') === o.url.length - 6); // TODO: maybe regexp woud be better, huh?
            },
            className = classNames({
                'col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas': true,
                'active': this.state.active
            }), height;

        var listParam = this.searchToObject().list;

        if (listParam) {
            if (listParam.toLowerCase() == 'cover') {
                isActiveFirstArticle = false; // if we have ?list=cover parameter in command line, don't highlight first article
            }
        }


        this.props.data.forEach(function add (o) {
            if (o['@type'] === 'Article' || _.chain(o.itemListElement).pluck('@type').contains('Article').value()) {
                isActive = o.name === window.location.hash.substring(1) || isActiveFirstArticle;
                isActiveFirstArticle = false;
                items.push(<Article data={o} key={items.length} active={this.active} isActive={isActive} />);
            } else if (o['@type'] === 'ItemList') {
                  var isContainItemList = _.chain(o.itemListElement).pluck('@type').contains('ItemList').value();
                  if(!isContainItemList) {
                      isActive = type === o.name;
                      if (isCover(o)) {
                          if(type === o.name) {
                              center.cover(o.itemListElement[0].url, false);
                              items.push(<Cover data={o} key={items.length} active={this.active} isActive={true} />);
                          } else {
                              items.push(<Cover data={o} key={items.length} active={this.active} isActive={false} />);
                          }
                      } else {
                          if(type === o.name) {
                              center.external(o.url, o.name);
                          }
                          items.push( <External data={o} key={items.length} active={this.active} isActive={isActive} />);
                      }
                  } else {
                      o.itemListElement.forEach(function (item) {
                          if (isCover(item)) {
                              isActive = type === item.name;
                              if(type === o.name) {
                                  center.cover(o.url, false);
                                  items.push(<Cover data={o} key={items.length} active={this.active} isActive={isActive} />);
                              } else {
                                  center.cover(o.itemListElement[0].url, true);
                                  items.push(<Cover data={item} key={items.length} active={this.active} isActive={isActive} />);
                              }
                          } else {
                              isActive = type === item.name;
                              if(isActive) {
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

        if(window.innerWidth > 767){
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
                    <ul className="nav nav-pills nav-stacked" style={height}>
                        {items}
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = CreateDomRight;
