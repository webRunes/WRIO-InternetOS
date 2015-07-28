var React = require('react'),
    center = require('../actions/center');

var External = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        active: React.PropTypes.func.isRequired
    },
    onClick: function () {
        center.external(this.props.data.url);
        this.props.active(this);
    },
    getInitialState: function () {
        return {
            active: false
        };
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
        active: React.PropTypes.func.isRequired
    },
    onClick: function () {
        center.article(this.props.data.name);
        this.props.active(this);
    },
    getInitialState: function () {
        return {
            active: false
        };
    },
    render: function () {
        var o = this.props.data,
            className = this.state.active ? 'active' : '';
        return (
            <li className={className}>
                <a onClick={this.onClick} className={o.class} >{o.name}</a>
            </li>
        );
    }
});

var Cover = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        active: React.PropTypes.func.isRequired
    },
    onClick: function () {
        center.cover();
        this.props.active(this);
    },
    getInitialState: function () {
        return {
            active: false
        };
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
    render: function () {
        var isCover = function (o) {
            return o.url && (typeof o.url === 'string') && (o.url.indexOf('?cover') === o.url.length - 6);
        },
            items = [];
        this.props.data.forEach(function add (o) {
            if (o['@type'] === 'Article') {
                items.push(<Article data={o} key={items.length} active={this.active} />);
            } else if (o['@type'] === 'ItemList') {
                o.itemListElement.forEach(function (item) {
                    if (isCover(item)) {
                        items.push(<Cover data={item} key={items.length} active={this.active} />);
                    } else {
                        items.push(<External data={item} key={items.length} active={this.active} />);
                    }
                }, this);
            }
            if (o.hasPart) {
                o.hasPart.forEach(add, this);
            }
        }, this);
        return (
            <div className="col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas" id="sidebar">
                <div className="sidebar-margin">
                    <ul className="nav nav-pills nav-stacked">
                        {items}
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = CreateDomRight;
