var React = require('react'),
    request = require('superagent'),
    cssUrl = require('../global').cssUrl,
    theme = require('../global').theme,
    themeImportUrl = require('../global').themeImportUrl;

// for article list in itemList view (if have url in json-ld then show aticle in listview otherwise same as article formate)
var CreateArticleLists = React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired,
        articlename: React.PropTypes.string.isRequired,
        about: React.PropTypes.string.isRequired
    },
    loadArticleFromServer: function(title, urlArticle, about) {
        var url = themeImportUrl + 'itemList.htm';  // itemList Path
        var CreateArticleID = title.replace(/\s/g, '_'); // Article ID
        var tHtml = '';
        request.get(
            url,
            function(err, data) {
                if (err) {
                    console.error(url, err.toString());
                }
                data = data.text;
                data = data.replace('<ul class="actions"><li><a href="#"><span class="glyphicon glyphicon-plus"></span>Add</a></li><li><a href="#"><span class="glyphicon glyphicon-share"></span>Share</a></li></ul>', '');
                var listHtml = data
                    .replace('{title}', '<a href="' + urlArticle + '">' + title + '</a>')
                    .replace('{sub_title}', title)
                    .replace('{about}', about)
                    .replace('{image}', cssUrl + theme + '/img/no-photo-200x200.png')
                    .replace('{created_date}', '22 Jun 2013')
                    .replace('{rating}', '244')
                    .replace('{readers}', '1,634')
                    .replace('{access}', 'Free');
                tHtml = '<div id="' + CreateArticleID + '">' + listHtml + '</div>';
                this.setState({data: tHtml});
            }.bind(this)
        );
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadArticleFromServer(this.props.articlename, this.props.url, this.props.about);
    },
    render: function() {
        return (
            <section dangerouslySetInnerHTML={{__html: this.state.data}} />
        );
    }
});

module.exports = CreateArticleLists;
