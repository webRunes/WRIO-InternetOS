'use strict'

import React from 'react'
import Actions from '../WRIO-InternetOS/js/actions/center'
import Details from'./Details.jsx'
import moment from 'moment'
import {getServiceUrl,getDomain} from '../WRIO-InternetOS/js/servicelocator.js'

var domain = getDomain();

class Login extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			title: {
				text: "Logged as I'm Anonymous ",
				label: 'WRIO',
				link: {
					url: "http://webrunes.com/",
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

		this.changePage = this.changePage.bind(this)

	}

	componentDidMount() {

		var that = this;

		window.addEventListener('message', function (e) {
			var message = e.data;
			var httpChecker = new RegExp('^(http|https)://login.' + domain, 'i');
			if (httpChecker.test(e.origin)) {
				var jsmsg = JSON.parse(message);

				if (jsmsg.login == "success") {
					location.reload();
				}

				if (jsmsg.profile) {
					jsmsg = jsmsg.profile;
					Actions.gotWrioID(jsmsg.id);
					if (jsmsg.temporary) {
						that.setState({
							title: {
								text: "Logged as I'm Anonymous ",
								label: 'WRIO',
								link: {
									url: jsmsg.url
								}
							},
							upgrade: {
								text: "Upgrade guest account for free",
								label: jsmsg.days + ' days left',
								visible: true
							}
						})
					} else {
						that.setState({
							title: {
								text: "Logged in as " + jsmsg.name,
								label: 'WRIO',
								link: {
									url: jsmsg.url
								}
							},
							upgrade: {
								text: "Lock up or switch user",
								label: jsmsg.days + ' days left',
								visible: false
							}
						});
					}
				}
			}
		});
	}

	static openAuthPopup(e) {
		window.open(getServiceUrl('login') + '/auth/twitter?callback=' + encodeURIComponent("//localhost:3000"), // TODO: WTF?
			"Login",
			"height=500,width=700");
		e.stopPropagation();
	}

	static logout(e) {
		location.href = getServiceUrl('login');
		e.stopPropagation();
	}

	changePage(){
		window.location.href = this.state.title.link.url;
	}

	render() {
		var has, upgrade, lock, that = this;
		if (this.state.upgrade.visible) {
			upgrade = <li>
						<span onClick={Login.openAuthPopup} >
							<i className="glyphicon glyphicon-arrow-up"></i>{this.state.upgrade.text}
						</span>
						<span className="label label-warning">{this.state.upgrade.label}</span>
					</li>;
			has = <li><span href="#"><i className="glyphicon glyphicon-user"></i>{this.state.have.text}</span></li>;
		}else{
			lock =
			<li>
				<span onClick={Login.logout}>
					<i className="glyphicon glyphicon-lock"></i>{this.state.upgrade.text}
				</span>
			</li>;
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
								<iframe id="loginbuttoniframe" src={ this.state.twitter.buttonurl } width="230" height="43" frameBorder="no" scrolling="no"></iframe>
							</div>
						</div>
					</span>

				</li>
			</ul>
		);
	}
}

Login.propTypes = {
	importUrl: React.PropTypes.object.isRequired,
	theme: React.PropTypes.object.isRequired
};

module.exports = Login;