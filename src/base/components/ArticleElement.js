/* @flow */
import React from 'react';
import ArticleLists from './ArticleLists';
import {replaceSpaces} from '../mixins/UrlMixin';
import SocialPost from "./SocialPost.js";
import ArticleEntity from '../jsonld/entities/Article'

class ArticleElement extends React.Component{
    props: {
        data: ArticleEntity
    };

    articleBody () {
        const element = this.props.data;

        if (element.getType() === "SocialMediaPosting") {
            return <SocialPost data={element} />;
        }
        const elements = element.getBody();
        return elements.map((item,i) => {
            return (<div className="paragraph" key={i}>
              <div className="col-xs-12">
                <div>{item}</div>
              </div>
            </div>);
        });
    }

    render () {
        const element = this.props.data;
        const articleName = element.getKey('name');
        let Parts;

        if (element.hasPart()) {
            Parts = this.props.data.children.map((child, key) => {
                if (child.data.url) {
                    return <ArticleLists data={child} key={key}/>;
                } else {
                    return <ArticleElement data={child} key={key}/>;
                }
            });
        }

        const chapter = replaceSpaces(element.data.name);

        const getHeader = () => (element.hasPart()) ?
            <h1 className="col-xs-12" id={chapter}>{articleName}</h1>:
            <h2 className="col-xs-12" id={chapter}>{articleName}</h2>;

        return (
            <section>
              {articleName !== undefined && getHeader()}
              <div className="clear" itemProp="articleBody">{this.articleBody()}</div>
              {Parts}
            </section>
        );
    }
};

export default ArticleElement;
