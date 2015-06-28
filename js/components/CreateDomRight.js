var React = require('react'),
    center = require('../actions/center');

var External = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    onClick: function () {
        center.external(this.props.data.url);
    },
    render: function () {
        var o = this.props.data;
        return (
            <li>
                <a onClick={this.onClick}>{o.name}</a>
            </li>
        );
    }
});

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    onClick: function () {
        center.article(this.props.data.name);
    },
    render: function () {
        var o = this.props.data;
        return (
            <li>
                <a onClick={this.onClick} className={o.class} >{o.name}</a>
            </li>
        );
    }
});

var Cover = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    onClick: function () {
        center.cover();
    },
    render: function () {
        var o = this.props.data;
        return (
            <li>
                <a onClick={this.onClick}>{o.name}</a>
            </li>
        );
    }
});

var CreateDomRight = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    render: function () {
        var isCover = function (o) {
            return o.url && (typeof o.url === 'string') && (o.url.indexOf('?cover') === o.url.length - 6);
        },
            items = [];
        this.props.data.forEach(function add (o, i) {
            if (o['@type'] === 'Article') {
                items.push(<Article data={o} key={items.length} />);
            } else if (o['@type'] === 'ItemList') {
                if (isCover(o)) {
                    items.push(<Cover data={o} key={items.length} />);
                }
                items.push(<External data={o} key={items.length} />);
            }
            if (o.hasPart) {
                o.hasPart.forEach(add);
            }
        });
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
