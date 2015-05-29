var React = require('react'),
	CreatArticleLists = require('./CreatArticleLists'),
	CreatArticleEl = require('./CreatArticleEl');

var CreateArticleList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment, index) {
			if(comment.is_article === false) {
				return false;
			}
			if (comment.url !== '') {
				return (
					<CreatArticleLists articlename={comment.articlename} url={comment.url} key={index} about={comment.about}>
						{comment.articleBody}
					</CreatArticleLists>
				);
			} else {
				return (
					<CreatArticleEl articlename={comment.articlename} key={index} hasPart={comment.hasPart}>
						{comment.articleBody}
					</CreatArticleEl>
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
