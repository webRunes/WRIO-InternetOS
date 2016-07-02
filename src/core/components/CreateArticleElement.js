import React from 'react';
import renderMentions from '../jsonld/renderMentions.js';
import CreateArticleLists from './CreateArticleLists';
import {replaceSpaces} from './CreateDomRight.js';
import SocialPost from "./SocialPost.js";

var CreateArticleElement = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    articleBody () {
        var o = this.props.data;
        o.articleBody = o.articleBody || [];

        if (o['@type'] === "SocialMediaPosting") {
            return <SocialPost data={o} />;
        }

        return o.articleBody.map(function (item, i) {
            if (o.m && o.m.articleBody && o.m.articleBody[i]) {
                item = renderMentions(o.m.articleBody[i]);
            }
            return (<div className="paragraph" key={i}>
                <div className="col-xs-12 col-md-6">
                   <div>{item}</div>
                </div>
                <div className="col-xs-12 col-md-6">
                    {/*  <aside>
                        <span className="glyphicon glyphicon-comment" title="Not yet available"></span>
                    </aside> */}
                </div>
            </div>);

        }, this);
    },

    render () {
        var o = this.props.data,
            articleName = o.name,
            Parts = null;
        if (o.m && o.m.name) {
            articleName = renderMentions(o.m.name);
        }
        if (o.hasPart) {
            Parts = o.hasPart.map(function (ϙ, key) {
                if (ϙ.url) {
                    return <CreateArticleLists data={ϙ} key={key}/>;
                } else {
                    return <CreateArticleElement data={ϙ} key={key}/>;
                }
            });
        }

        var chapter = replaceSpaces(o.name);

        return (
            <section>
                {(o.hasPart) ?
                    <h1 id={chapter}>{articleName}</h1>:
                    <h2 id={chapter}>{articleName}</h2>
                }
                <div itemProp="articleBody">{this.articleBody()}</div>
                {Parts}
            </section>
        );
    }
});
module.exports = CreateArticleElement;
