// @flow
import React from 'react';
import { getResourcePath } from '../global.js';
import UrlMixin from '../mixins/UrlMixin';
import Thumbnail from './misc/ListThumbnail.js';
import PropTypes from 'prop-types';
import Ticket from './Ticket';
import ItemList from '../jsonld/entities/ItemList.js';
import LdJsonObject from '../jsonld/entities/LdJsonObject';

// TODO check if it is needed ?

const ItemListElement = ({ item }: { item: LdJsonObject }) => {
  const title = item.getKey('name');
  const image =
    item.getKey('image') ||
    item.getKey('contentUrl') ||
    getResourcePath('/img/no-photo-200x200.png');
  const about = item.getKey('about');
  const url = item.getKey('url');

  return <Ticket title={title} description={about} url={url} image={image} />;
};

const ItemListComponent = ({ data }: { data: ItemList }) => {
  const r = data.children.map((item, key) => <ItemListElement item={item} key={key} />);

  return (
    <div>
      <div className="paragraph list-paragraph">
        <div className="col-xs-12 col-md-12">{data.getKey('description')}</div>
      </div>
      {r}
    </div>
  );
};

export default ItemListComponent;
