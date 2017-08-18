import React from 'react';
import {fixUrlProtocol} from '../mixins/UrlMixin';
import WrioDocument from '../store/WrioDocument.js';
import WrioDocumentActions from '../actions/WrioDocument.js';
import Login from '../../widgets/Login.js';
import mention from '../jsonld/mentions/mention.js';

var CreateCover = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        isActive: React.PropTypes.bool.isRequired
    },

    componentDidMount: () => {


    },

    logout() {
        Login.doLogout();
        WrioDocumentActions.showLockup(false);
        WrioDocumentActions.changeDocumentChapter('article', '');
    },



    render: function () {
        var cover = this.props.data;
        var path = cover.data.contentUrl; //cover.img;
        var name = cover.getKey('name');
        var about = cover.getKey('about');
        var isActive = this.props.isActive ? 'item active' : 'item';

        if (path) {
            path = fixUrlProtocol(path);
        }

        var button;

        if (cover.action == 'Logout') {
            button = (
                <button type="button" className="btn btn-success btn-lg" onClick={this.logout}>
                    <span className="glyphicon glyphicon-user"></span>Login as anonymous
                </button>);
        } else {
            button = (
                <button type="button" className="btn btn-success btn-lg" onClick={Login.doLogin}>
                    <span className="glyphicon glyphicon-user"></span>Login with Twitter
                </button>);
        }



        return (
            <div className={isActive}>
              <div className="img" style={{background: 'url(' + path + ')'}}></div>
                <div className="carousel-caption">
                    <div className="carousel-text">
                        <h2>{name}</h2>
                        <h6>{about}</h6>
                        {this.coverItems(cover)}
                        {WrioDocument.lockupShown ? button : ''}
                    </div>
                </div>
            </div>
        );
    }
});

export default CreateCover;
