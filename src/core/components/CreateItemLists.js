import React from 'react';
import {getResourcePath} from '../global.js';
import UrlMixin from '../mixins/UrlMixin';

// TODO check if it is needed ?

const CreateItemLists = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    render: function() {
        var item = this.props.data,
            title = item.getKey('name'),
            image = item.data.image || getResourcePath('/img/no-photo-200x200.png'),
            about = item.getKey('about'),
            url = item.getKey('url'),
            createdDate = item.getKey('datePublished');

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
                  <div className="img pull-left" background="{image}"></div>
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
