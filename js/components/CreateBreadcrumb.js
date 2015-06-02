var React = require('react');

module.exports = React.createClass({
    propTypes: {
        converter: React.PropTypes.object.isRequired
    },
    render: function () {
        var htmlBreadcrumb = '<ul class="breadcrumb controls tooltip-demo"><li title="Read time" data-placement="top" data-toggle="tooltip"><span class="glyphicon glyphicon-time"></span>4-5 minutes</li><li title="Last modified" data-placement="top" data-toggle="tooltip"><span class="glyphicon glyphicon-calendar"></span>30 May, 2014</li></ul><ul itemprop="breadcrumb" class="breadcrumb"><li class="active">Read</li><li><a href="#">Edit</a></li></ul>';
        var rawMarkup = this.props.converter.makeHtml(htmlBreadcrumb.toString());
        if (rawMarkup === '') {
            return null;
        }
        return (
            <section dangerouslySetInnerHTML={{__html: rawMarkup}}></section>
        );
    }
});
