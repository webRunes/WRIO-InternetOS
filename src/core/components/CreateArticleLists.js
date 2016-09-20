import React from 'react';
import renderMentions from '../jsonld/renderMentions.js';
import {getResourcePath} from  '../global';
import Article from '../jsonld/entities/Article.js';

import UrlMixin from '../mixins/UrlMixin';
import {replaceSpaces} from '../components/CreateDomRight.js';

var CreateArticleLists = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    render: function() {
        var item = this.props.data,
            articleName = item.getKey('name'),
            articleHash = replaceSpaces(articleName);
        if (! item instanceof Article) {
            console.warn("Warning, wrong object passing to renderer");
            return null;
        }
        return (
            <a href={UrlMixin.fixUrlProtocol(item.url)}>
                <article>
                    <div className="media thumbnail clearfix" id="plusWrp">
                        <header className="col-xs-12">
                            <h2 id={articleHash}>
                                <span>{articleName}</span>

                            </h2>
                        </header>
                        <div className="col-xs-12 col-md-6 pull-right">
                             <img className="pull-left" src={getResourcePath('/img/no-photo-200x200.png')} />
                             {/*(o.image) ? <img className="pull-left" src={o.image} /> : null*/}

                            {
                            <ul className="details">
                                <li>Language: En</li>
                                <li>Author: </li>
                                {/*<li>Created: 22 Jun 2013</li>
                                <li>Rating: 244</li>
                                <li>Readers: 1,634</li>*/}
                                <li>Access: Free</li>
                            </ul>
                            }
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <p>{item.about}</p>
                            {/*
                            <ul className="actions">
                                <li><span className="glyphicon glyphicon-plus"></span>Add</li>
                                <li><span className="glyphicon glyphicon-share"></span>Share</li>
                            </ul>
                            */}
                            <p></p>
                        </div>
                    </div>
                </article>
            </a>
        );
    }
});

module.exports = CreateArticleLists;
