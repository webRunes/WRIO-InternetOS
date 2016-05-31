import React from 'react';
import mentions from '../mixins/mentions';
import {getResourcePath} from  '../global';

import UrlMixin from '../mixins/UrlMixin';

var CreateArticleLists = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    mixins: [mentions],

    render: function() {
        var o = this.props.data,
            articleName = o.name;
        if (o['@type'] !== 'Article') {
            return null;
        }
        if (o.m && o.m.name) {
            articleName = this.applyMentions(o.m.name);
        }
        return (
            <a href={UrlMixin.fixUrlProtocol(o.url)}>
                <article>
                    <div className="media thumbnail clearfix" id="plusWrp">
                        <header className="col-xs-12">
                            <h2 id={articleName}>
                                <span>{articleName}</span>
                                {/* <sup>{o.name}</sup> */}
                            </h2>
                        </header>
                        <div className="col-xs-12 col-md-6 pull-right">
                            {/* <img className="pull-left" src={getResourcePath('/img/no-photo-200x200.png')} /> */}
                            (o.image) ? <img className="pull-left" src={o.image} /> : null

                            {/*
                            <ul className="details">
                                <li>Created: 22 Jun 2013</li>
                                <li>Rating: 244</li>
                                <li>Readers: 1,634</li>
                                <li>Access: Free</li>
                            </ul>
                            */}
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <p>{o.about}</p>
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
