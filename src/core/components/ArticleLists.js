import React from 'react';
import {getResourcePath} from  '../global';
import Article from '../jsonld/entities/Article.js';

import UrlMixin from '../mixins/UrlMixin';
import {replaceSpaces} from '../components/CreateDomRight.js';

const ArticleLists = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    render: function() {
        let item = this.props.data,
            articleName = item.getKey('name'),
            about = item.getKey('about'),
            articleHash = replaceSpaces(articleName),
            image = item.data.image || getResourcePath('/img/no-photo-200x200.png');
        if (item.getType() !== 'Article') {
            // if itemlist is passed, just skip
            return null;
        }
        return (
            <a href={UrlMixin.fixUrlProtocol(item.data.url)}>
                <article>
                    <div className="media thumbnail clearfix" id="plusWrp">
                        <header className="col-xs-12">
                            <h2 id={articleHash}>
                                <span>{articleName}</span>

                            </h2>
                        </header>
                        <div className="col-xs-12 col-md-6 pull-right">
                             <div className="img pull-left" background="{image}"></div>
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
                            <p>{about}</p>
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

export default ArticleLists;
