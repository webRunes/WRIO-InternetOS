var React = require('react'),
    center = require('../actions/CreateDomCenter');

var External = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    onClick: function () {
        center.show(this.props.data.url);
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
        center.show();
    },
    render: function () {
        var comment = this.props.data,
            commentMenustring = comment.name.replace(/\s/g, '_'),
            href = comment.url ? comment.url : '#' + commentMenustring,
            listURl = '#' + commentMenustring,
            menuClass = comment.class;
        return (
            <li>
                <a onClick={this.onClick} className={menuClass} data-url={href}>{comment.name}</a>
            </li>
        );
    }
});

var Cover = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    onClick: function () {
        center.show('cover');
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
    isCover: function (o) {
        return o.url && (typeof o.url === 'string') && (o.url.indexOf('?cover') === o.url.length - 6);
    },
    render: function () {
        var commentItemMenus = this.props.data.map(function(o, i) {
            if (o.class === 'articleView') {
                return <Article data={o} key={i} />;
            } else if (o.class === 'listView') {
                if (this.isCover(o)) {
                    return <Cover data={o} key={i} />;
                }
                return <External data={o} key={i} />;
            }
        }, this);
        return (
            <div className="col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas" id="sidebar">
                <div className="sidebar-margin">
                    <ul className="nav nav-pills nav-stacked">
                        {commentItemMenus}
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = CreateDomRight;
