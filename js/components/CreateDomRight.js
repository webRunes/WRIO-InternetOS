var React = require('react');

var CreateDomRight = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        converter: React.PropTypes.object.isRequired
    },
    render: function () {
        var commentItemMenus = this.props.data.map(function(comment, index) {
            var commentMenustring = comment.name.replace(/\s/g, '_');
            var href = comment.url ? comment.url : '#' + commentMenustring;
            var listURl = '#' + commentMenustring;
            var menuClass = comment.class;
                return (
                    <li key={index}>
                        <a href={listURl} className={menuClass} data-url={href}>{comment.name}</a>
                    </li>
                );
        });
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
