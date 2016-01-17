import React from 'react';
import {getServiceUrl,getDomain} from '../WRIO-InternetOS/js/servicelocator.js';
import Login from './Login.jsx';

var domain = getDomain();

export default class Chess extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: !1,
            disabled: true,
            twitter: {
                buttonurl: getServiceUrl('login') + "/buttons/twitter"
            }
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
                        $.get(getServiceUrl('chess') + '/data?uuid=' + this.props.uuid + '&wrid=' + jsmsg.id, (res) => {
                            this.setState({
                                profile: jsmsg,
                                user: res.user,
                                invite: res.invite,
                                alien: res.alien,
                                expired: res.expired,
                                footer: res.alien ? "This link is for the player @" + res.user.username : (res.expired ? "Link Expired" : "...please wait")
                            });
                        });
                    }
                }
            }
        });
    }

    componentDidMount() {
        if (this.state.profile && !this.state.expired && !this.state.alien) {
            this.start();
        }
    }
    
    start() {
        if (this.state.invite && this.state.invite !== '') {
            $.ajax({
                type: 'POST',
                url: getServiceUrl('chess') + '/api/invite_callback',
                data: {
                    uuid: this.props.uuid,
                    invite: this.state.invite
                }
            }).success(() => {
                this.state.footer = 'Game started, you can return to Twitter';
                window.close();
            }).fail(() => {
                this.state.footer = 'Link Expired';
            });
        } else {
            $.ajax({
                type: 'POST',
                url: getServiceUrl('chess') + '/api/access_callback',
                data: {
                    uuid: this.props.uuid
                }
            }).success(() => {
                this.state.footer = 'Game started, you can return to Twitter';
                window.close();
            });
        }
    }

    render() {
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