/**
 * Created by michbil on 10.05.16.
 */

import JSONDocument from '../JSONDocument.js';
import {saveToS3,getWidgetID} from '../webrunesAPI.js';
import React from 'react';
import {extractFileName, parseUrl,appendIndex} from '../utils/url.js';
import getHttp from '../../../base/utils/request';

export function urlMatch () {
    return window.location.search.match(/\?comment_article=([\. _0-9a-zA-Z%:\/?]*)/);
}

export default class CommentSaver extends React.Component {
    constructor(props) {
        super(props);
        var editUrl = urlMatch();
        if (editUrl) {
            editUrl = appendIndex(decodeURIComponent(editUrl[1]));
            console.log(editUrl);
        }

        var editUrlParsed = parseUrl(editUrl);
        if (editUrlParsed) {
            var saveUrl = extractFileName(editUrlParsed.pathname);
        }
        this.state = {
            busy: false,
            url: editUrl,
            saveUrl: saveUrl,
            msg: "Downloading page..."
        };
    }

    componentDidMount() {
        document.getElementById("loadingInd").setAttribute('style','display:none;');

    }

    saveComment(url) {
        this.setState({
            busy:true
        });
        getHttp(url).then((article) => {
            setTimeout(window.frameReady, 300);
            this.setState({
                msg:"Receiving comment id...."
            });
            getWidgetID(url).then((id)=> {
                var doc = new JSONDocument(article);
                doc.setCommentID(id);
                var html = doc.toHtml();
                this.setState({
                    msg:"Saving page to S3...."
                });
                return saveToS3(this.state.saveUrl,html);
            }).then((res) => {
                    this.setState({msg:"Success!",busy:false});
                    parent.postMessage(JSON.stringify({reload:true}),"*");
            }).catch((err) => {
                console.log(err);
                this.setState({
                    msg:"Oops... something went wrong",
                    busy: false
                });
            });
        }).catch(error=> {
            this.setState({
                msg:"Failed to download page"
            });
            setTimeout(()=> this.setState({busy:false}),2000);
        });
    }

    doSave() {
        this.saveComment(this.state.url);
    }


    render() {

        var buttonStyle = "btn btn-sm btn-primary" + (this.state.busy?" disabled":"");

        return (
          <div>
            <ul className="breadcrumb"><li className="active">Comments</li></ul>
            <div className="well enable-comment text-left">
              <h4>Comments disabled</h4>
              <p>Comments haven't been enabled by you.</p>
              <br />
              <a className={buttonStyle} href="#" role="button" onClick={this.doSave.bind(this)}>
                <span className="glyphicon glyphicon-comment"></span>
                {this.state.busy ? <span><img src="https://default.wrioos.com/img/loading.gif"/>{this.state.msg}</span>:"Enable comments"}
              </a>
            </div>
          </div>);
    }
}
