require('babel-polyfill');
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import request from 'superagent';
import {applyMentions} from './mixins/mentions';
import getHttp from '../../base/utils/request';
import CoreEditor from './CoreEditor.js';
import {ContentBlock, CharacterMetadata} from 'draft-js';
import Immutable from 'immutable';
import JSONDocument from './JSONDocument.js';
import CommentSaver from './CommentSaver.js';
import {urlMatch as CommentSaverUrlMatch} from './CommentSaver.js';
import {parseEditingUrl, extractFileName, parseUrl, appendIndex} from './utils/url.js';
import WrioStore from './stores/wrio.js';

var domain = process.env.DOMAIN;

class Loading extends Component {
    render () {
        return (<div>
                Loading editor <img src="https://default.wrioos.com/img/loading.gif" id="loadingInd"/>
            </div>);
    }
}

class LoadingError extends Component {
    render () {
        return (<div className="alert alert-danger">
            Oops, something went wrong... Please try again
        </div>);
    }
}


class Client extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startHeader: '<h2>',
            endHeader: '</h2>',
            wrioID: '',
            saveUrl: '',
            saveDisabled: 0,
            editUrl:'',
            coreAdditionalHeight: 200,
            mentions: [],
            render: false,
            doc: null,
            error: false
        };
        this.parseEditingUrl = this.parseEditingUrl.bind(this);
        this.parseArticleCore = this.parseArticleCore.bind(this);
    }
    formatAuthor(id) {
        return id ? `https://wr.io/${id}/?wr.io=${id}` : 'unknown';
    }
    parseEditingUrl() {
        const [editUrl, saveRelativePath] = parseEditingUrl();
        this.setState({
            editUrl: editUrl,
            saveRelativePath: saveRelativePath
        });
    }
    componentWillMount() {
        document.getElementById("loadingInd").setAttribute('style','display:none;');
        this.parseEditingUrl();
        let wrioID = null;
        WrioStore.listen((state) => {
            if (!this.state.render)
            {
                this.parseArticleCore(state.wrioID).then((res)=>
                        this.setState({
                            wrioID,
                            render: true
                        })
                ).catch((e)=> console.error(e.stack));
            }
        });
    }
    async parseArticleCore(author) {
        if (window.location.pathname === "/create") {
            var doc = new JSONDocument();
            doc.createArticle(author, "");
            this.setState({
                doc: doc
            });
        } else {
            try {
                const inDoc = await getHttp(this.state.editUrl);
                setTimeout(window.frameReady, 300);
                var doc = new JSONDocument(inDoc.data);
                this.setState({
                    doc: doc,
                });
            } catch (error) {
                console.log("Unable to download source article",error);
                this.setState({error:true});
            }
        }
    }

    componentDidUpdate() {
        frameReady();
    }

    render() {
        return (
            <div cssStyles={{width: '100%'}} className="clearfix">
                {this.state.error? <LoadingError /> : ""}
                {this.state.render ? <CoreEditor doc={this.state.doc}
                            saveRelativePath={this.state.saveRelativePath}
                            editUrl={this.state.editUrl}
                            author={this.formatAuthor(this.state.wrioID)} /> :
                    <Loading /> }

            </div>
        );
    }
}

// TODO switch to full routing there
ReactDom.render( CommentSaverUrlMatch() ? <CommentSaver /> : <Client /> , document.getElementById('clientholder'));

var oldHeight = 0;
window.frameReady = () => {
    let height = document.querySelector('#clientholder').clientHeight + 2;
    if (height != oldHeight) {
        oldHeight = height;
        console.log("Height ready");
        parent.postMessage(JSON.stringify({
            "coreHeight": height
        }), "*");
    }
};
