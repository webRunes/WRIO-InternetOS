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
    <div className="col-sm-8 col-md-9 toggle-field">
      <div className="togglebutton">
        <label>
          <input
            name="isChecked"
            type="checkbox"
            checked={isChecked}
            onChange={handleInputChange}
          />
          <span className="toggle" />
          <div className="toggle-label">
            {isChecked ? 'Comments enabled' : 'Comments disabled'}
          </div>
        </label>
      </div>
    </div>
  );
};

export default CommentEnabler;
