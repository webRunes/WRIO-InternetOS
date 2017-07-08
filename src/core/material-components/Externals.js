/**
 * Created by michbil on 30.06.17.
 */

import React from 'react';
import CreateItemList from '../components/ItemList.js';
import ItemList from '../jsonld/entities/ItemList.js';

/*
 *  Base class rendering document body
 * */

export default class Externals extends React.Component {

    constructor(props) {
        super(props);
    }

    props: {
        data: Array<ItemList>
    };

    getItemLists(data) {
        data = data || [];
        return data.filter((o) => o.data instanceof ItemList)
            .map((list, key) => <CreateItemList data={list.data} key={key}/>);
    }

    render () {
        if (!this.props.data) {
            return (<img src="https://default.wrioos.com/img/loading.gif"/>);
        } else {
            let r =  this.getItemLists(this.props.data);
            return <div> {r} </div>;
        }
    }

}