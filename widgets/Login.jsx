import React from 'react';
import Actions from '../WRIO-InternetOS/js/actions/center';
import Details from'./Details.jsx';
import moment from 'moment';
import {getServiceUrl,getDomain} from '../WRIO-InternetOS/js/servicelocator.js';
import WindowActions from '../WRIO-InternetOS/js/actions/WindowActions.js';
import CenterActions from '../WRIO-InternetOS/js/actions/center.js';
import UserStore from '../WRIO-InternetOS/js/store/UserStore.js';

var domain = getDomain();

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            title: {
                text: "Logged as I'm Anonymous ",
                label: 'WRIO',
                link: {
                    url: "https://webrunes.com/",
                    text: "Profile page"
                }
            },
            upgrade: {
                text: 'Upgrade guest account for free',
                label: '30 days left',
                visible: true
            },
            have: {
                text: 'Already have an account?'
            },
            twitter: {
                url: getServiceUrl("login") + "/auth/twitter",
                buttontext: getServiceUrl("login") + "/auth/twitter",
                buttonurl: getServiceUrl("login") + "/buttons/twitter"
            },
            description: 'Информация публичного профайла доступна любому, даже незарегистрированным пользователям. Если вы хотите оставаться анонимным, просто не заполняйте его.'
        };

        this.changePage = this.changePage.bind(this);

    }

    componentDidMount() {

        var that = this;

        WindowActions.loginMessage.listen((jsmsg) => {
            if (jsmsg.login == "success") {
                //location.reload();

            }

            if (jsmsg.profile) {
                var profile = jsmsg.profile;
                Actions.gotWrioID(profile.id);
                Actions.gotAuthor(profile.url);
                if (!profile.temporary) {
                    UserStore.saveLoggedUser(profile.id,profile);
                }


                if (profile.temporary) {
                    that.setState({
                        title: {
                            text: "Logged as I'm Anonymous ",
                            label: 'WRIO',
                            link: {
                                url: profile.url
                            }
                        },
                        upgrade: {
                            text: "Upgrade guest account for free",
                            label: profile.days + ' days left',
                            visible: true
                        }
                    });
                } else {
                    that.setState({
                        title: {
                            text: "Logged in as " + profile.name,
                            label: 'WRIO',
                            link: {
                                url: profile.url
                            }
                        },
                        upgrade: {
                            text: "Lock or switch user",
                            label: profile.days + ' days left',
                            visible: false
                        }
                    });
                }
            }
        });
    }

    static openAuthPopup(e) {

        document.getElementById('loginbuttoniframe').contentWindow.postMessage('login', getServiceUrl('login'));
        e.stopPropagation();
    }

    static setWRIOAuthData(e) {
        document.getElementById('loginbuttoniframe').contentWindow.postMessage('setData', getServiceUrl('login'));
        e.stopPropagation();
    }

    static logout(e) {
        Login.doLogout();
        Login.showLockup(e);
        e.stopPropagation();

    }

    static showLockup(e) {
        e.stopPropagation();
        CenterActions.showLockup.trigger(true);
    }

    static doLogout() {
        document.getElementById('loginbuttoniframe').contentWindow.postMessage('logout', getServiceUrl('login'));
    }

    static doLogin() {
        document.getElementById('loginbuttoniframe').contentWindow.postMessage('login', getServiceUrl('login'));
        CenterActions.showLockup.trigger(false);
    }

    changePage(){
        window.location.href = this.state.title.link.url;
    }

    render() {
        var has, upgrade, lock, that = this;
        if (this.state.upgrade.visible) {
            upgrade = (<li>
                        <span onClick={Login.openAuthPopup} >
                            <i className="glyphicon glyphicon-arrow-up"></i>{this.state.upgrade.text}
                        </span>
                        <span className="label label-warning">{this.state.upgrade.label}</span>
                    </li>);
            has = (<li>
                <span href="#" onClick={Login.showLockup}>
                    <i className="glyphicon glyphicon-user"></i>{this.state.have.text}
                </span>
                </li>);
        }else{
            lock =
                (<li>
                    <span onClick={Login.logout}>
                        <i className="glyphicon glyphicon-lock"></i>{this.state.upgrade.text}
                    </span>
                </li>);
        }


        return (
            <ul className="info nav nav-pills nav-stacked" id="profile-accordion">
                <li className="panel">
                    <a href="#profile-element" data-parent="#profile-accordion" data-toggle="collapse">
                        <i className="glyphicon glyphicon-chevron-down pull-right"></i>{this.state.title.text}
                        <sup>{this.state.title.label}</sup>
                    </a>

                    <span className="in" id="profile-element" onClick={that.changePage}>
                        <div className="media thumbnail clearfix">
                            <Details importUrl={this.props.importUrl} theme={this.props.theme}/>
                            <div className="col-xs-12 col-md-6">
                                <p>{this.state.description}</p>
                                <ul className="actions">
                                    {upgrade}
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
    importUrl: React.PropTypes.string.isRequired,
    theme: React.PropTypes.string.isRequired
};

module.exports = Login;