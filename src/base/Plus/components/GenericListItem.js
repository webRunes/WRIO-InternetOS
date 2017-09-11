import React from 'react';
import {CrossStorageFactory} from '../../utils/CrossStorageFactory.js';

var storage = CrossStorageFactory.getCrossStorage();

class GenericListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    gotoUrl(e) {
        e.preventDefault();
        this.props.onClick(this.props.data);
    }

}

GenericListItem.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = GenericListItem;