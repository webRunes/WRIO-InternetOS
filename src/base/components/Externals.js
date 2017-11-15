// @flow
/**
 * Created by michbil on 30.06.17.
 */

import React from 'react';
import ItemListComponent from './ItemList.js';
import ItemList from '../jsonld/entities/ItemList.js';
import Loading from 'base/components/misc/Loading';

/*
 *  Base class rendering document body
 * */

const Externals = ({ data }: { data: Array<ItemList> }) => {
  if (!data) {
    return <Loading />;
  }
  return data.map((list, key) => <ItemListComponent data={list} key={key} />);
};

export default Externals;
