import React from 'react';
import {fixUrlProtocol} from '../mixins/UrlMixin';
import WrioDocument from '../store/WrioDocument.js';
import WrioDocumentActions from '../actions/WrioDocument.js';
import Login from '../../widgets/Login.js';
import CenterStore from '../store/center.js';
import CenterActions from '../actions/center.js';
import renderMentions from '../jsonld/renderMentions.js';
import _ from 'lodash';
import mention from '../jsonld/mention.js';

var CreateCover = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        isActive: React.PropTypes.bool.isRequired
    },

    componentDidMount: () => {


    },

    logout() {
        Login.doLogout();
        CenterActions.showLockup(false);
        WrioDocumentActions.changeDocumentChapter('article', '');
    },

    applyMentions(cover) {
        return cover.text.map((item, i) => {
            var appliedMention = {};
            if (cover.m && cover.m.text && cover.m.text[i]) {
                appliedMention.text = renderMentions(cover.m.text[i],1);
                appliedMention.bullet = cover.m.text[i];
            } else {
                if (mention.isBulletItem(cover.text[i])) {
                    appliedMention.bullet = true;
                }
                appliedMention.text = mention.skipAsterisk(cover.text[i]);
            }

            return appliedMention;
        });
    },

    coverItems(cover) {
        var items = this.applyMentions(cover) || [];
        var descr = [];
        var bulletList = [];

        function purgeList() {
            if (bulletList.length !== 0) {
                descr.push(<ul className="features">{bulletList.map(item => <li><span className="glyphicon glyphicon-ok"></span>{item}</li>)}</ul>);
                bulletList = [];
            }
        }

        items.forEach((item,i) => {
            if (item.bullet) {
                bulletList.push (item.text);
            } else {
                purgeList();
                descr.push(<div className="description">{item.text}</div>);
            }

        });
        purgeList();


        return descr;

    },

    render: function () {
        var cover = this.props.data;
        var path = cover.contentUrl; //cover.img;
        var name = cover.name;
        var about = cover.about;
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

        if (cover.m) {

            if (cover.m.name)  name = renderMentions(cover.m.name);
            if (cover.m.about) about = renderMentions(cover.m.about);
        }


        return (
            <div className={isActive}>
                <div className="img" style={{background: 'url(' + path + ') center center'}}></div>
                <div className="carousel-caption">
                    <div className="carousel-text">
                        <h2>{name}</h2>
                        <h6>{about}</h6>
                        {this.coverItems(cover)}
                        {CenterStore.lockupShown ? button : ''}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CreateCover;
