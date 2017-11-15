/* @flow */
import React from 'react';
import { getResourcePath } from '../global';
import Article from '../jsonld/entities/Article.js';
import UrlMixin from '../mixins/UrlMixin';
import { replaceSpaces } from '../mixins/UrlMixin';
import Thumbnail from './misc/ListThumbnail.js';
import LdJsonObject from '../jsonld/entities/LdJsonObject';
import Ticket from './Ticket';

const ArticleLists = ({ data }: { data: LdJsonObject }) => {
  let item = data,
    articleName = item.getKey('name'),
    about = item.getKey('about'),
    articleHash = replaceSpaces(articleName), // getting react compponent instead of text on this!
    image = item.data.image || getResourcePath('/img/no-photo-200x200.png');
  if (item.getType() !== 'Article') {
    // if itemlist is passed, just skip
    return null;
  }
  return (
    <Ticket
      title={articleName}
      description={about}
      url={item.data.url}
      hash={articleHash}
      image={image}
    />
  );
};

export default ArticleLists;
