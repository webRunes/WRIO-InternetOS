import React from 'react';
import Details from'./Details.js';
import {getServiceUrl,getDomain} from '../../servicelocator.js';
import WindowActions from '../../actions/WindowActions.js';
import {Dropdown,MenuItem,Glyphicon} from 'react-bootstrap'
var domain = getDomain();

const LoginButton = ({onLogin}) => {
    return (
        <a href="#" className="btn btn-just-icon btn-simple btn-default btn-sm btn-flat pull-right">
            <i className="material-icons dp_big">account_circle</i>
            Login
        </a>
    )
};

const performLogout = () => {
    WindowActions.resetLogin.trigger();
    document.getElementById('loginbuttoniframe').contentWindow.postMessage('logout', getServiceUrl('login'));
};

export const performLogin  = () => {
    WindowActions.resetLogin.trigger();
    window.open(getServiceUrl('login')+'/auth/twitter?callback='+encodeURIComponent('/buttons/callback'), "Login", "height=500,width=700");
    //document.getElementById('loginbuttoniframe').contentWindow.postMessage('login', getServiceUrl('login'));
};

const Login = ({profile}) => {
    return (<Dropdown id="dropdown-custom-1" pullRight >
        <Dropdown.Toggle className="btn-just-icon btn-simple btn-default btn-lg btn-flat">
            <i className="material-icons dp_big">account_circle</i> {profile.temporary ? "Temporary account" : profile.name}
        </Dropdown.Toggle>
        <Dropdown.Menu >
            <MenuItem eventKey="1" href={profile.url}>
                <i className="material-icons dp_big">perm_identity</i>Profile
            </MenuItem>
            <MenuItem divider />
            {!profile.temporary ? <MenuItem eventKey="2" onClick={performLogout}>
                <i className="material-icons dp_big">exit_to_app</i>Logout
            </MenuItem> :
            <MenuItem eventKey="2" onClick={performLogin}>
                <i className="material-icons dp_big">exit_to_app</i>Login
            </MenuItem>}
        </Dropdown.Menu>
    </Dropdown>);
}

/*
class OldLogin extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            busy: true,
            title: {
                text: "Logged as I'm Anonymous ",
                label: "WRIO",
                link: {
                    url: "https://webrunes.com/",
                    text: "Profile page"
                }
            },
            upgrade: {
                text: "Upgrade guest account for free",
                label: "30 days left",
                visible: true
            },
            have: {
                text: "Login with Twitter"
            },
            twitter: {
                url: getServiceUrl("login") + "/auth/twitter",
                buttontext: getServiceUrl("login") + "/auth/twitter",
                buttonurl: getServiceUrl("login") + "/buttons/twitter"
            },
            description: "Information in the public profile is available to any person, even unregistered users. If you want to stay anonimous, simply don't fill it in."
        };

        this.changePage = this.changePage.bind(this);

    }



    setTemporoary(temporary) {
        if (temporary) {
            this.setState({
                title: {
                    text: "Logged as I'm Anonymous ",
                    label: "WRIO",
                    link: {
                        url: profile.url
                    }
                },
                upgrade: {
                    text: "Upgrade guest account for free",
                    label: profile.days + " days left",
                    visible: true
                }
            });
        } else {
            this.setState({
                title: {
                    text: "Logged in as " + profile.name,
                    label: "WRIO",
                    link: {
                        url: profile.url
                    }
                },
                upgrade: {
                    text: "Log out",
                    label: profile.days + " days left",
                    visible: false
                }
            });
        }

    }

    static openAuthPopup(e) {

        document.getElementById('loginbuttoniframe').contentWindow.postMessage('login', getServiceUrl('login'));
        e.stopPropagation();
    }

    static setWRIOAuthData(e) {
        document.getElementById('loginbuttoniframe').contentWindow.postMessage('setData', getServiceUrl('login'));
        e.stopPropagation();
    }

    static showLockup(e) {
        e.stopPropagation();
    }

    doLogout(e) {
        e.stopPropagation();
        WindowActions.resetLogin.trigger();
        document.getElementById('loginbuttoniframe').contentWindow.postMessage('logout', getServiceUrl('login'));
        this.setState({busy:true});
    }

    static requestLogin() {
        WindowActions.resetLogin.trigger();
        window.open(getServiceUrl('login')+'/auth/twitter?callback='+encodeURIComponent('/buttons/callback'), "Login", "height=500,width=700");
        //document.getElementById('loginbuttoniframe').contentWindow.postMessage('login', getServiceUrl('login'));
    }

    doLogin(e) {
        e.stopPropagation();
        Login.requestLogin();
        this.setState({busy:true});
    }

    changePage(){
        window.location.href = this.state.title.link.url;
    }

    render() {
        var has, upgrade, lock;

        if (this.state.busy) {
            return (<img src="https://default.wrioos.com/img/loading.gif" />);
        }



        if (this.state.upgrade.visible) {
            upgrade = (<li>
                        <span onClick={Login.openAuthPopup} >
                            <i className="glyphicon glyphicon-arrow-up"></i>{this.state.upgrade.text}
                        </span>
                        <span className="label label-warning">{this.state.upgrade.label}</span>
                    </li>);
            has = (<li>
                <span href="#" onClick={this.doLogin.bind(this)}>
                    <i className="glyphicon glyphicon-user"></i>{this.state.have.text}
                </span>
                </li>);
        } else {
            lock =
                (<li>
                    <span onClick={this.doLogout.bind(this)}>
                        <i className="glyphicon glyphicon-lock"></i>{this.state.upgrade.text}
                    </span>
                </li>);
        }


        return (
            <ul className="info nav nav-pills nav-stacked hidden" id="profile-accordion">
              <li className="panel">
                <a href="#profile-element" data-parent="#profile-accordion" data-toggle="collapse">
                  <i className="glyphicon glyphicon-chevron-down pull-right"></i>{this.state.title.text}

                </a>

                <span className="in" id="profile-element" onClick={this.changePage}>
                  <div className="media thumbnail clearfix">
                    <Details />
                    <div className="col-xs-12 col-md-6">
                      <p>{this.state.description}</p>
                      <ul className="actions">
                        {has}
                        {lock}
                      </ul>
                    </div>
                  </div>
                </span>

                </li>
            </ul>
        );
    }
}

Login.propTypes = {

}; */

export default Login;
