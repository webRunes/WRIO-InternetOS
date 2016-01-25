import React from 'react';
import {getServiceUrl,getDomain} from '../WRIO-InternetOS/js/servicelocator.js';
import Login from './Login.jsx';
import request from 'superagent';

var domain = getDomain();

export default class Chess extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: !1,
            disabled: true
        };
    }

    componentWillMount() {
        window.addEventListener('message', (e) => {
            var message = e.data;
            var httpChecker = new RegExp('^(http|https)://login.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                var jsmsg = JSON.parse(message);

                if (jsmsg.login == "success") {
                    location.reload();
                }

                if (jsmsg.profile) {
                    jsmsg = jsmsg.profile;
                    if (jsmsg.temporary) {
                        this.setState({
                            disabled: false,
                            footer: ''
                        });
                    } else {
                        request.get(getServiceUrl('chess') + '/data?uuid=' + this.props.uuid + '&wrid=' + jsmsg.id, (err, res) => {
                            if (res) {
                                res = res.body || {};
                                this.setState({
                                    profile: jsmsg,
                                    user: res.user,
                                    invite: res.invite,
                                    alien: res.alien,
                                    expired: res.expired,
                                    footer: res.alien ? "This link is for the player @" + res.user.username : (res.expired ? "Link Expired" : "...please wait")
                                });
                            } else {
                                this.setState({
                                    disabled: false,
                                    footer: 'Authorisation error. Please try again later.'
                                });
                            }
                        });
                    }
                }
            }
        });
    }
    
    start() {
        if (this.state.invite && this.state.invite !== '') {
            request.post(getServiceUrl('chess') + '/api/invite_callback')
                .send({
                    uuid: this.props.uuid,
                    invite: this.state.invite
                })
                .end((err, res) => {
                    if (err || !res) {
                        this.setState({
                            footer: 'Link expired',
                            expired: true
                        });
                    } else {
                        this.setState({
                            footer: 'Game started, you can return to Twitter',
                            expired: true
                        });
                        window.close();
                    }
                });
        } else {
            request.post(getServiceUrl('chess') + '/api/access_callback')
                .send({
                    uuid: this.props.uuid
                }).end((err, res) => {
                    if (err || !res) {
                        this.setState({
                            footer: 'Link expired',
                            expired: true
                        });
                    } else {
                        this.setState({
                            footer: 'Game started, you can return to Twitter',
                            expired: true
                        });
                        window.close();
                    }
                });
        }
    }

    render() {
        if (this.state.profile && !this.state.expired && !this.state.alien) {
            this.start();
        }

        var button = this.state.invite ? "Accept" : "Start";
        var _button = this.state.invite ? "Login & Accept" : "Login & Start";

        var style = {
            marginTop: '10px'
        };

        this.state.form = this.state.profile ?
            <div>
                <h4> {this.state.profile.name} </h4>
                <button type="button" className="btn btn-default" onClick={Login.logout}> Log out </button>
                <button type="button" className="btn btn-primary ok" disabled = {this.state.disabled}><span className="glyphicon glyphicon-ok"></span>{button}</button >
                <h4>{this.state.footer}</h4>
            </div> :
            <div>
                <button type="button" className="btn btn-primary ok" style={style} onClick={Login.openAuthPopup} disabled={this.state.disabled}><span className = "glyphicon glyphicon-ok"></span>{_button}</button>
                <h4>{this.state.footer}</h4>
            </div>;

        return (
            <div style={{textAlign: 'center'}} className="form-group">
                {this.state.form}
            </div>
        );
    }
}

Chess.propTypes = {
    uuid: React.PropTypes.string.isRequired
};