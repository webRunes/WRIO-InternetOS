/**
 * Created by michbil on 29.04.16.
 */
import React from "react";
import PropTypes from "prop-types";

var domain = process.env.DOMAIN;

const CommentEnabler = ({ isChecked, onCheck }) => {
  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    onCheck(value);
  }

  return (
    <div className="form-group">
      <label
        htmlFor="id-Comment"
        className="col-xs-6 col-sm-4 col-md-3 control-label"
      >
        {false && (
          <span
            className="glyphicon glyphicon-question-sign"
            aria-hidden="true"
            data-toggle="tooltip"
            data-placement="left"
            title="Comments work through the Twitter. The Advanced mode is designed for those wishing to have full control over comments. For the reasons of security we do not save the password from you Twitter account, thus you need to re-enter it every time you turn the Advanced mode on."
          />
        )}Comments
      </label>
      <div className="col-xs-6 col-sm-4 col-md-4">
        <div className="togglebutton">
          <label>
            <input
              name="isChecked"
              type="checkbox"
              checked={isChecked}
              onChange={handleInputChange}
            />
            <span className="toggle" />Enabled
          </label>
        </div>
      </div>
    </div>
  );
};

export default CommentEnabler;
