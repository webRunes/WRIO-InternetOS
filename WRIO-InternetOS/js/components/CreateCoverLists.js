var React = require('react'),
    cssUrl = require('../global').cssUrl,
    theme = require('../global').theme;


var CreateCoverLists = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    render: function() {
        var o = this.props.data;
        var path = cssUrl + theme;

        return (
            <div id="cover-carousel" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    {this.props.children}
                </div>
                <a className="left carousel-control" href="#cover-carousel" data-slide="prev">
                    <span className="glyphicon glyphicon-chevron-left"></span>
                </a>
                <a className="right carousel-control" href="#cover-carousel" data-slide="next">
                    <span className="glyphicon glyphicon-chevron-right"></span>
                </a>
            </div>
        );
    }
});

module.exports = CreateCoverLists;
