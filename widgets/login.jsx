var domain = '';
var Actions = require('../WRIO-InternetOS/js/actions/center');

if (process.env.DOMAIN == undefined) {
    domain = 'wrioos.com';
} else {
    domain = process.env.DOMAIN;
}

  var
    React = require('react'),
    moment = require('moment'),
    Details = React.createClass({
      getInitialState: function() {
        var props = this.props;
        return {
          img: props.importUrl + props.theme + '/img/no-photo-200x200.png',
          registered: moment(Date.now()).format('DD MMM YYYY')
        };
      },
      render: function() {
        return (
          <div className='col-xs-12 col-md-6 pull-right'>
              <span itemScope="" itemType="http://schema.org/ImageObject">
                  <img itemProp="thumbnail" src={this.state.img} className="pull-left" />
              </span>
              <ul className="details">
                  <li>Registered: {this.state.registered}</li>
                  <li>Rating: {this.state.rating}</li>
                  <li>Followers: {this.state.followers}</li>
                  <li>Posts: {this.state.posts}</li>
              </ul>
          </div>
        );
      }
    }),
    Login = React.createClass({
      getInitialState: function() {
        return {
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
            visible: false
          },
          have: {
            text: 'Already have an account?'
          },
          twitter: {
            url: "http://login."+domain+"/auth/twitter",
            buttonurl:"http://login."+domain+"/buttons/twitter",
            img: 'http://www.foodini.co/assets/sign-in-with-twitter-icon-4ab300ee57991db4bd4b4517c5b8e9ed.jpg'
          },
          description: 'Информация публичного профайла доступна любому, даже незарегистрированным пользователям. Если вы хотите оставаться анонимным, просто не заполняйте его.'
        };
      },
        componentDidMount: function () {
            var that = this;


            window.addEventListener('message', function (e) {
                var message = e.data;
                var httpChecker = new RegExp('^(http|https)://login.' + domain, 'i');
                if (httpChecker.test(e.origin)) {
                    console.log("Got message login", message);
                    var jsmsg = JSON.parse(message);

                    if (jsmsg.loggedIn) {
                        //$('#loginbuttoniframe').hide();
                    }
                    if (jsmsg.login == "success") {
                        location.reload();
                    }

                    if (jsmsg.profile) {
                        jsmsg = jsmsg.profile;
                        Actions.gotWrioID(jsmsg.id);
                        var state;

                        if (jsmsg.temporary) {
                            state = {
                                upgrade: {
                                    text: "Upgrade guest account for free",
                                    label: jsmsg.days + ' days left',
                                    visible: true

                                },
                                title:{
                                    text: "Logged as I'm Anonymous ",
                                        label: 'WRIO',
                                        link: {
                                            url: jsmsg.url
                                        }
                                }
                            }
                        } else {
                            state = {
                                title:{
                                    text: "Logged in as "+jsmsg.name,
                                    label: 'WRIO',
                                    link: {
                                        url: jsmsg.url
                                    }
                                },
                                upgrade: {
                                    visible:false
                                }
                            }
                        }
                        that.setState(state);
                    }

                }

            });
        },
      render: function() {
        var props = this.props;
          var upgrade,has;
          if (this.state.upgrade.visible) {
              upgrade = <li><a href="wrio-account-edit.htm"><span className="glyphicon glyphicon-arrow-up"></span>{this.state.upgrade.text}</a> <span className="label label-warning">{this.state.upgrade.label}</span></li>;
              has = <li><a href="#"><span className="glyphicon glyphicon-user"></span>{this.state.have.text}</a></li>;
          }
          return (
          <ul className="info nav nav-pills nav-stacked" id="profile-accordion">
              <li className="panel">
                  <a href="#profile-element" data-parent="#profile-accordion" data-toggle="collapse">
                    <span className="glyphicon glyphicon-chevron-down pull-right"></span>{this.state.title.text}<sup>{this.state.title.label}</sup>
                  </a>
                  <a className="in" id="profile-element" href={this.state.title.link.url}>
                      <div className="media thumbnail clearfix">
                          <Details importUrl={props.importUrl} theme={props.theme} />
                          <div className="col-xs-12 col-md-6">
                              <p>{this.state.description}</p>
                              <ul className="actions">
                                  {upgrade}
                                  {has}
                              </ul>
                              <iframe id="loginbuttoniframe" src={ this.state.twitter.buttonurl } width="230" height="43" frameBorder="no" scrolling="no"></iframe>

                          </div>
                      </div>
                  </a>
              </li>
          </ul>
        );
      }
    });

module.exports = Login;
