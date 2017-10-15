import React from "react";
import PropTypes from "prop-types";

class UserInfo extends React.Component {
  render() {
    return (
      <div>
        <h4>as {this.props.username}</h4>
        <a href="/logoff">Logoff</a>
      </div>
    );
  }
}
UserInfo.propTypes = {
  username: PropTypes.string.isRequired
};

export default UserInfo;
