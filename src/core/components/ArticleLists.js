/* @flow */
import React from 'react';
import {getResourcePath} from  '../global';
import Article from '../jsonld/entities/Article.js';
import UrlMixin from '../mixins/UrlMixin';
import {replaceSpaces} from '../mixins/UrlMixin';
import Thumbnail from './misc/ListThumbnail.js';
import LdJsonObject from '../jsonld/entities/LdJsonObject'

const ArticleLists = ({data} : {data : LdJsonObject}) => {

        let item = data,
            articleName = item.getKey('name'),
            about = item.getKey('about'),
            articleHash = replaceSpaces(articleName),
            image = item.data.image || getResourcePath('/img/no-photo-200x200.png');
        if (item.getType() !== 'Article') {
            // if itemlist is passed, just skip
            return null;
        }
        return (
        <div>
          <a href={UrlMixin.fixUrlProtocol(item.data.url)}>
            <div className="card ticket card-blog card-atv">
              <div className="card-content">
                <div className="card-text">
                  <Thumbnail image={image} />
                  <div className="arrow-more"><i className="material-icons">more_horiz</i></div>
                  <div className="gradient"></div>
                  <h3 className="visible-xs-block" >
                    {articleName}
                  </h3>
                  <h2 className="hidden-xs" id={articleHash}>{articleName}</h2>
                  <p>{about}</p>
                </div>
                <div className="footer">
                  <div className="author hidden">
                    <a href="#">
                      <img src="https://d1qb2nb5cznatu.cloudfront.net/startups/i/2451505-51a29f6e9299fda6472b55c1477f799f-medium_jpg.jpg" alt="..." className="avatar" />
                      <span>WRIO OS</span>
                    </a>
                  </div>
                  <div className="stats hidden">
                    <i className="material-icons">schedule</i> 5 min read
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      );

};

export default ArticleLists;
