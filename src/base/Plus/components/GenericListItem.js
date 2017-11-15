import React from "react";
import { CrossStorageFactory } from "../../utils/CrossStorageFactory.js";
import PropTypes from "prop-types";

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
  data: PropTypes.object.isRequired
};

module.exports = GenericListItem;
