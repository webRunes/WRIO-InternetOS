/* @flow */
import React from 'react';
import { getResourcePath } from '../global';
import Article from '../jsonld/entities/Article.js';
import UrlMixin from '../mixins/UrlMixin';
import { replaceSpaces } from '../mixins/UrlMixin';
import Thumbnail from './misc/ListThumbnail.js';
import LdJsonObject from '../jsonld/entities/LdJsonObject';

type TicketTypes = {
  title: string,
  description: string,
  url: string,
  hash: starting,
  image: string,
};

const Ticket = ({
  title, description, image, url, hash }: 
TicketTypes) => (
    <div>
    <a href={UrlMixin.fixUrlProtocol(url)}>
      <div className="card ticket card-blog card-atv">
          <div className="card-content">
          <div className="card-text" id={hash}>
            <Thumbnail image={image} />
            <div className="arrow-more">
                <i className="material-icons">more_horiz</i>
              </div>
            <div className="gradient" />
            <h3 className="visible-xs-block">{title}</h3>
            <h2 className="hidden-xs">{title}</h2>
            <p>{description}</p>
          </div>
          <div className="footer">
            <div className="author hidden">
                <a href="#">
                <img src={image} alt={description} className="avatar" />
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

export default Ticket;
