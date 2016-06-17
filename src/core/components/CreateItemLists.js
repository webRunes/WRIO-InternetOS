import React from 'react';
import {getResourcePath} from '../global.js';
import UrlMixin from '../mixins/UrlMixin';

var CreateItemLists = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    render: function() {
        var item = this.props.data,
            title = item.name,
            image = getResourcePath('/img/no-photo-200x200.png'), //item.thumbnail,
            about = item.about,
            url = item.url,
            createdDate = item.datePublished;

        return (
            <a href={UrlMixin.fixUrlProtocol(url)}>
            <article>
              <div className="media thumbnail clearfix" >
                <header className="col-xs-12">
                  <h2>
                      {title}
                  </h2>
                </header>
                <div className="col-xs-12 col-md-6 pull-right">
                  <img className="pull-left" src={image} />
                  <ul className="details">
                    <li>Created: {createdDate}</li>
                    <li>Access: Free</li>
                  </ul>
                </div>

                <div className="col-xs-12 col-md-6">
                  <p>{about}</p>
                </div>
              </div>
            </article>
          </a>
        );
    }
});

module.exports = CreateItemLists;
