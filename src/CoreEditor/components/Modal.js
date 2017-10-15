/**
 * Created by michbil on 18.07.17.
 */

import React from "react";
import PropTypes from "prop-types";

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    $("#confirm-delete").show();
  }

  onOk() {
    this.props.onOk();
    $("#confirm-delete").hide();
  }

  onCancel() {
    $("#confirm-delete").hide();
    this.props.onCancel();
  }

  render() {
    return (
      <div
        className="modal"
        id="confirm-delete"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="false"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Delete</h4>
            </div>
            <div className="modal-body">Are you sure you want to delete?</div>
            <div className="modal-footer">
              <a className="btn btn-danger btn-ok" onClick={this.onOk}>
                <span className="glyphicon glyphicon-trash" />Delete
              </a>
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
                onClick={this.onCancel}
              >
                <span className="glyphicon glyphicon-remove" />Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};
