import Ticket from 'base/components/Ticket';
import React from 'react';
import { Loading } from './Loading';

const ListElement = ({ data, onListChange }) => {
  const image = data.image || 'https://default.wrioos.com/img/no-photo-200x200.png';
  const T = data.name && <Ticket title={data.name} description={data.about} image={image} />;
  return (
    <div className="card ticket card-blog card-atv">
      <div>
        Link URL:{' '}
        <input
          className="form-control"
          onChange={e => onListChange('url', e.target.value)}
          value={data.url}
        />
      </div>
      <div>
        Title:{' '}
        <input
          className="form-control"
          onChange={e => onListChange('name', e.target.value)}
          value={data.name}
        />
      </div>
      <div>
        Description:{' '}
        <input
          className="form-control"
          onChange={e => onListChange('about', e.target.value)}
          value={data.about}
        />
      </div>
      <div>
        Image URL:{' '}
        <input
          className="form-control"
          onChange={e => onListChange('image', e.target.value)}
          value={data.image}
        />
      </div>
      {data.loading ? <Loading /> : T}
    </div>
  );
};

const ListEditor = ({ items, onAddElement, onListChange }) => (
  <div className="clearfix">
    {items.map(el => <ListElement data={el} key={el.key} onListChange={onListChange(el.key)} />)}
    <button className="btn" onClick={onAddElement}>
      Add element
    </button>
  </div>
);

export default ListEditor;
