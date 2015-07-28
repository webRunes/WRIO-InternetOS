var React = require('react'),
    mentions = require('../mixins/mentions'),
    CreateArticleLists = require('./CreateArticleLists');

var CreateArticleElement = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    mixins: [mentions],
    articleBody: function () {
        var o = this.props.data;
        o.articleBody = o.articleBody || [];
        return o.articleBody.map(function (item, i) {
            if (o.m && o.m.articleBody && o.m.articleBody[i]) {
                item = this.applyMentions(o.m.articleBody[i]);
            }
            return <div key={i}>{item}</div>;
        }, this);
    },
    render: function() {
        var data = this.props.data,
            articleName = data.name,
            Parts = null;
        if (data.m && data.m.name) {
            articleName = this.applyMentions(data.m.name);
        }
        if (data.hasPart) {
            Parts = data.hasPart.map(function (o, key) {
                if (o.url) {
                    return <CreateArticleLists data={o} key={key} />;
                } else {
                    return <CreateArticleElement data={o} key={key} />;
                }
            });
        }
        return (
            <section>
                {(data.hasPart) ?
                    <h1 id={data.name}>{articleName}</h1> :
                    <h2 id={data.name}>{articleName}</h2>
                }
                <div className="paragraph">
                    <div className="col-xs-12 col-md-6">
                        {this.articleBody()}
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
