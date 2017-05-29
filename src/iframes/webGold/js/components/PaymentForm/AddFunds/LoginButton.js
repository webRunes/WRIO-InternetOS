import React from 'react';

class LoginButton extends React.Component {
    openAuthPopup() {
        var loginUrl = this.props.loginUrl;
        var callbackurl = window.location.protocol + '//' + window.location.host + '/callback';
        window.open(loginUrl + 'authapi?callback=' + encodeURIComponent(callbackurl), "Login", "height=500,width=700");
    }
    
    render() {
        return (
            <button type="button" onClick={ this.openAuthPopup.bind(this) } className="btn btn-primary">
                <span className="glyphicon glyphicon-ok"></span>Login and Donate
            </button>
        );
    }
}
LoginButton.propTypes = {
    loginUrl: React.PropTypes.string.isRequired
};


export default LoginButton;