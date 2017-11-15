// @flow
/**
 * Created by michbil on 30.06.17.
 */

import React from 'react';
import ItemListComponent from './ItemList.js';
import ItemList from '../jsonld/entities/ItemList.js';

/*
 *  Base class rendering document body
 * */

const Externals = ({ data }: { data: Array<ItemList> }) => {
  if (!data) {
    return <img src="https://default.wrioos.com/img/loading.gif" alt="loading" />;
  }
  return data.map((list, key) => <ItemListComponent data={list} key={key} />);
};

export default Externals;
