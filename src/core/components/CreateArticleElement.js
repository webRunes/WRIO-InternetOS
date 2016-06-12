var React = require('react'),
    mentions = require('../mixins/mentions'),
    CreateArticleLists = require('./CreateArticleLists');

var CreateArticleElement = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    mixins: [mentions],
    articleBody: function() {
        var o = this.props.data;
        o.articleBody = o.articleBody || [];
        return o.articleBody.map(function(item, i) {
            if (o.m && o.m.articleBody && o.m.articleBody[i]) {
                item = this.applyMentions(o.m.articleBody[i]);
            }
            return <div key={i}>{item}</div>;
        }, this);
    },
    render: function() {
        var o = this.props.data,
            articleName = o.name,
            Parts = null;
        if (o.m && o.m.name) {
            articleName = this.applyMentions(o.m.name);
        }
        if (o.hasPart) {
            Parts = o.hasPart.map(function(ϙ, key) {
                if (ϙ.url) {
                    return <CreateArticleLists data={ϙ} key={key} />;
                } else {
                    return <CreateArticleElement data={ϙ} key={key} />;
                }
            });
        }
        return (
            <section>
                {(o.hasPart) ?
                    <h1 id={o.name}>{articleName}</h1> :
                    <h2 id={o.name}>{articleName}</h2>
                }
                <div className="paragraph">
                    <div className="col-xs-12 col-md-6">
                        <p>{this.articleBody()}</p>
                    </div>
                    <div className="col-xs-12 col-md-6">
                        <aside>
                            <span className="glyphicon glyphicon-comment" title="Not yet available" />
                        </aside>
                    </div>
                </div>
                {Parts}
            </section>
        );
    }
});

module.exports = CreateArticleElement;
