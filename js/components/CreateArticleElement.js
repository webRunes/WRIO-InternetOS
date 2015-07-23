var React = require('react'),
    request = require('superagent'),
    importUrl = require('../global').importUrl,
    theme = require('../global').theme;

module.exports = React.createClass({
    propTypes: {
        converter: React.PropTypes.object.isRequired,
        articlename: React.PropTypes.string.isRequired,
        hasPart: React.PropTypes.bool.isRequired,
        children: React.PropTypes.node
    },
    loadArticleFromServer: function(title, children, hasPart, rawMarkup) {
        var url = importUrl + theme + '/widget/article.htm';  // Article Path
        var CreateArticleID = title.replace(/\s/g, '_'); // Article ID
        request.get(
            url,
            function(err, data) {
                if (err) {
                    console.error(url, err.toString());
                }
                data = data.text;
                var html;
                if(hasPart === true){
                    if(rawMarkup === ''){
                        html = '<h2 id="{this.props.articleid}">{this.props.articlename}</h2>';
                    } else {
                        html = data.replace('<header class="col-xs-12"><h1 id="{this.props.articleid}">{this.props.articlename}</h1></header>', '<h2 id={this.props.articleid}>{this.props.articlename}</h2>');
                    }
                } else {
                    html = data;
                }
                var res = html.replace(/{this.props.articlename}/g, title);
                res = res.replace(/{this.props.articleid}/g, CreateArticleID);
                res = res.replace('{description}', children);
                res = res.replace(/<p>/g, ' <div class="paragraph"><div class="col-xs-12 col-md-6"><p itemprop="description">');
                res = res.replace(/p>/g, ' </p></div><div class="col-xs-12 col-md-6"><aside><span class="glyphicon glyphicon-comment" data-toggle="tooltip" data-placement="right" title="Not yet available"></span></aside></div></div>');
                this.setState({data: res});
            }.bind(this)
        );
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        var rawMarkup = this.props.converter.makeHtml(this.props.children.toString());
        this.loadArticleFromServer(
            this.props.articlename,
            this.props.children,
            this.props.hasPart,
            rawMarkup
        );
    },
    render: function() {
        return (
            <section dangerouslySetInnerHTML={{__html: this.state.data}} />
        );
    }
});
