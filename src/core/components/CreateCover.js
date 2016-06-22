import React from 'react';
import {fixUrlProtocol} from '../mixins/UrlMixin';
import WrioDocument from '../store/WrioDocument.js';
import WrioDocumentActions from '../actions/WrioDocument.js';
import Login from '../../widgets/Login.js';
import CenterStore from '../store/center.js';
import CenterActions from '../actions/center.js';
import applyMentions from '../jsonld/applyMentions.js';
import _ from 'lodash';

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

    isBulletItem(str) {
        if (typeof str === "string") {
            return str.match(/^\*/m);
        }
        return false;
    },

    skipAsterisk(str) {
        if (typeof str === "string") {
            return str.replace(/^\*/m, '');
        }
        return str;
    },

    skipAsteriskFromMention(mention) {
        var tItem = _.cloneDeep(mention);// clone array
        if (this.isBulletItem(tItem[0].before)) {
            tItem[0].before = this.skipAsterisk(mention[0].before);
        }
        return tItem;
    },

    applyMentions(cover) {
        return cover.text.map((item, i) => {
            var appliedMention;
            if (cover.m && cover.m.text && cover.m.text[i]) {
                appliedMention = applyMentions(this.skipAsteriskFromMention(cover.m.text[i]),1);
            } else {
               return this.skipAsterisk(cover.text[i]);
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
            var bullet = false;
            if (this.isBulletItem(cover.text[i])) {
                bullet = true;
            }
            if (bullet) {
                bulletList.push (item);
            } else {
                purgeList();
                descr.push(<div className="description">{item}</div>);
            }

        });
        purgeList();


        return descr;

    },

    render: function () {
        var cover = this.props.data;
        var path = cover.contentUrl; //cover.img;
        var name = cover.name;
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
                <div className="img" style={{background: 'url(' + path + ') center center'}}></div>
                <div className="carousel-caption">
                    <div className="carousel-text">
                        <h2>{name}</h2>
                        {this.coverItems(cover)}
                        {CenterStore.lockupShown ? button : ''}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CreateCover;
