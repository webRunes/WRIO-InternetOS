import React from 'react';

class UserInfo extends React.Component {
    render() {
        return (
            <div>
                <h4>as { this.props.username }</h4>
                <a href="/logoff">Logoff</a>
            </div>
        );
    }
}
UserInfo.propTypes = {
    username: React.PropTypes.string.isRequired
};

export default UserInfo;