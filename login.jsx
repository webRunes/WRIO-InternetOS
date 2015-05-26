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
              <span itemscope itemtype="http://schema.org/ImageObject">
                  <img itemprop="thumbnail" src={this.state.img} className="pull-left" />
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
            label: '30 days left'

          },
          have: {
            text: 'Already have an account?'
          },
          twitter: {
            url: "http://login.webrunes.com/auth/twitter",
            img: 'http://www.foodini.co/assets/sign-in-with-twitter-icon-4ab300ee57991db4bd4b4517c5b8e9ed.jpg'
          },
          description: 'Информация публичного профайла доступна любому, даже незарегистрированным пользователям. Если вы хотите оставаться анонимным, просто не заполняйте его.'
        };
      },
        componentDidMount: function () {
            var that = this;
            window.addEventListener('message', function (e) {
                var message = e.data;
                if (e.origin == "http://storage.webrunes.com") {
                    console.log("Got message storage", message);
                    var jsmsg = JSON.parse(message);
                    that.setState({
                        upgrade: {
                            text: "Upgrade guest account for free",
                            label: jsmsg.days + ' days left'

                        },
                        title:{
                            text: "Logged as I'm Anonymous ",
                            label: 'WRIO',
                            link: {
                                url: jsmsg.url,
                                text: "My profile"
                            }

                        }
                    });
                }
                if (e.origin == "http://login.webrunes.com") {
                    console.log("Got message login", message);
                    var jsmsg = JSON.parse(message);
                    if (jsmsg.login == "success") {
                        location.reload();
                    }
                }


            });
        },
      render: function() {
        var props = this.props;
        return (
          <ul className="info nav nav-pills nav-stacked" id="profile-accordion">
              <li className="panel">
                  <a href="#profile-element" data-parent="#profile-accordion" data-toggle="collapse">
                    <span className="glyphicon glyphicon-chevron-down pull-right"></span>{this.state.title.text}<sup>{this.state.title.label}</sup>
                  </a>
                  <div className="in" id="profile-element">
                      <div className="media thumbnail clearfix">
                          <Details importUrl={props.importUrl} theme={props.theme} />
                          <div className="col-xs-12 col-md-6">
                              <p>{this.state.description}</p>
                              <a href={this.state.title.link.url}>{this.state.title.link.text}</a>
                              <ul className="actions">
                                  <li>
                                    <iframe id="storageiframe" src="http://storage.webrunes.com"></iframe>
                                    <a href="wrio-account-edit.htm"><span className="glyphicon glyphicon-arrow-up"></span>{this.state.upgrade.text}</a> <span className="label label-warning">{this.state.upgrade.label}</span>
                                  </li>
                              </ul>
                              <ul className="actions">
                                  <li>
                                    <a href="#"><span className="glyphicon glyphicon-user"></span>{this.state.have.text}</a>
                                  </li>
                              </ul>
                              <iframe id="loginbuttoniframe" src="http://login.webrunes.com/buttons/twitter" width="230" height="43" frameBorder="no" scrolling="no"></iframe>

                          </div>
                      </div>
                  </div>
              </li>
          </ul>
        );
      }
    });

module.exports = Login;
