var React = require('react'),
    CreateArticleLists = require('./CreateArticleLists'),
    CreateArticleElement = require('./CreateArticleElement');

var CreateArticleList = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    render: function() {
        var commentNodes = this.props.data.map(function(comment, index) {
            if(comment.is_article === false) {
                return false;
            }
            if (comment.url !== '') {
                return (
                    <CreateArticleLists articlename={comment.articlename} url={comment.url} key={index} about={comment.about}>
                        {comment.articleBody}
                    </CreateArticleLists>
                );
            } else {
                return (
                    <CreateArticleElement converter={this.props.converter} articlename={comment.articlename} key={index} hasPart={comment.hasPart}>
                        {comment.articleBody}
                    </CreateArticleElement>
                );
            }
        });
        return (
            <article>
                {commentNodes}
            </article>
        );
    }
});

module.exports = CreateArticleList;
