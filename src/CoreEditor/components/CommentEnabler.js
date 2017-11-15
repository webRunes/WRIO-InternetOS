/**
 * Created by michbil on 29.04.16.
 */
import React from 'react';
import PropTypes from 'prop-types';

const domain = process.env.DOMAIN;

const CommentEnabler = ({ isChecked, onCheck }) => {
  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    onCheck(value);
  }

  return (
    <div className="col-xs-3 col-sm-3 col-md-3">
      <div className="togglebutton">
        <label>
          <input
            name="isChecked"
            type="checkbox"
            checked={isChecked}
            onChange={handleInputChange}
          />
          <span className="toggle" />
          {isChecked ? 'Comments Enabled' : 'Comments disabled'}
        </label>
      </div>
    </div>
  );
};

export default CommentEnabler;
