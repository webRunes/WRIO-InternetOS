import React from 'react';
import UrlMixin from '../mixins/UrlMixin';
import { getResourcePath } from '../global';
import Thumbnail from './misc/ListThumbnail';
import Ticket from './Ticket';
import Loading from 'base/components/misc/Loading';

const ItemListElement = ({
  name, about, image, url,
}) => {
  const itemImage = image || getResourcePath('/img/no-photo-200x200.png');
  return <Ticket name={name} description={about} url={url} image={itemImage} />;
};

const ReadItLater = ({ RIL }) => {
  if (!RIL) {
    return <Loading />;
  }
  const tabs = RIL;
  return (
    <div>{tabs.map((t, i) => <ItemListElement key={i} name={t.name} about="" url={t.url} />)}</div>
  );
};

export default ReadItLater;
