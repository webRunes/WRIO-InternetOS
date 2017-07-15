/**
 * Created by michbil on 19.11.16.
 */

import React from 'react';
import {parseEditingUrl, extractFileName, parseUrl, appendIndex} from '../utils/url.js';
import WrioStore from '../stores/wrio.js';
import CommentEnabler from './CommentEnabler.js';

function prepFileName(name) {
    let res = name.replace(/ /g,'_');
    return res.substring(0,120);
}

const createMode = () => window.location.pathname === "/create";


const WillBeLive = (props) => {
    return (<div className="form-group">
        <label className="col-xs-12 col-sm-4 col-md-3 control-label hidden-xs">&nbsp;</label>
        <div className="col-xs-12 col-sm-8 col-md-9">
            <div className="help-block">Your page will be live at {props.savePath}</div>
        </div>
    </div>);
};
WillBeLive.propTypes = {
    savePath:  React.PropTypes.string
};

export default class PostSettings extends React.Component {
    constructor(props) {
        super(props);
        this.source = 'save';
        this.dropdownSources = {
            'save':"WRIO OS",
            "saveas":"Save as.."
        };
        const [editUrl, saveRelativePath] = parseEditingUrl();
        this.state = {
            maxLength: 512,
            saveFile: "Untitled",
            dropdownSource: this.dropdownSources['save'],
            editUrl,
            saveRelativePath,
            busy: false,
            userStartedEditing: false,
            alert: false
        };
        Object.assign(this.state,this.applyDescription(props.description));
    }

    componentDidMount() {
        this.listener = WrioStore.listen(this.storeListener.bind(this));
    }

    componentWillUnmount() {
        this.listener();
    }

    storeListener(state) {
        this.setState({busy: state.busy});
        if (state.header && createMode()) {
            if (!this.state.userStartedEditing) {
                this.setState({
                    saveFile: prepFileName(state.header)
                });
            }
        }
    }



    publish() {
        this.props.onPublish(this.source,this.fileSavePattern(), this.getSaveUrl(),this.state.description);
    }

    setSource(src) {
        this.source = src;
        this.setState({
            dropdownSource: this.dropdownSources[src]
        });
    }

    onChangeDescr(e) {
        this.setState(this.applyDescription(e.target.value));
    }

    applyDescription(value) {
        if (value.length >= this.state.maxLength) {
            return({
                exceedLength: true,
                description: value
            });
        } else {
            return({
                exceedLength: false,
                description: value
            });
        }
    }

    onChangeFile(e) {
        this.setState({
            userStartedEditing: true,
            saveFile: prepFileName(e.target.value)
        });
    }

    genDropdownSource(name) {
        const active = this.state.dropdownSource == this.dropdownSources[name];
        return (<li>
            <a href="#" onClick={() => this.setSource(name)}>
                {active && <span className="glyphicon glyphicon-ok pull-right"></span>}
                {this.dropdownSources[name]}</a>
        </li>);
    }

    fileSavePattern() {
        if (this.props.saveUrl) {
            const exp = /[0-9]+\/(.+)/;
            const m = this.props.saveUrl.match(exp);
            if (m[1]) {
                return m[1];
            }
        } else {
            return `${this.state.saveFile}/index.html`;
        }

    }

    getSaveUrl() {
        return this.props.saveUrl || `https://wr.io/${WrioStore.getWrioID()}/${this.fileSavePattern()}`;
    }

    render () {
        const loading = <img src="https://default.wrioos.com/img/loading.gif" style={{color: "red",margin:"0 4px 0"}}  />;
        let savePath = this.getSaveUrl();
        const className ="form-group" +  (this.state.exceedLength ? " has-error" : "");
        return (<div className="form-horizontal col-xs-12">
          <div className={className}>
            <label htmlFor="id-Description" className="col-sm-4 col-md-3 control-label">Description</label>
            <div className="col-sm-8 col-md-9">
              <textarea className="form-control" type="text" maxLength="512"
                cols="40"
                rows="6"
                placeholder="Optional. Max 512 characters"
                value={this.state.description}
                onChange={this.onChangeDescr.bind(this)} />
              <div className="help-block">
                {this.state.exceedLength && <span>Max {this.state.maxLength} characters</span>}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="id-Storage" className="col-xs-6 col-sm-4 col-md-3 control-label"><span className="glyphicon glyphicon-question-sign" aria-hidden="true" data-toggle="tooltip" data-placement="left" title="Use [Save as..] to save your file locally for its further manual transfer to any server or service such as Google Drive, Dropbox, GitHub Pages and etc."></span> Storage</label>
            <div className="col-xs-6 col-sm-4 col-md-4">
              <div className="btn-group dropdown-menu-full-width">
                <button type="button" className="btn btn-white btn-block dropdown-toggle ia-author" data-toggle="dropdown">
                  <span className="caret"></span>{this.state.dropdownSource}
                </button>
                <ul className="dropdown-menu" role="menu">
                  {this.genDropdownSource('save')}
                  {this.genDropdownSource('saveas')}
                </ul>
              </div>
            </div>
           {!this.props.saveUrl && <div className="col-xs-6 col-sm-4 col-md-5">
                  <input type="text"
                         className="form-control"
                         id="File-name"
                         placeholder="Untitled"
                         value={this.state.saveFile}
                         onChange={this.onChangeFile.bind(this)}
                      />
              </div>}
          </div>
            <WillBeLive savePath={savePath} />
            <CommentEnabler commentID={this.props.commentID}
                            author={this.props.author}
                            editUrl={this.getSaveUrl()}
                            />
            <div className="col-xs-12">
                <div className="pull-right">
                    {/* -Temp delete removing-!createMode() &&
                    <button type="button" className="btn btn-danger" onClick={() => this.setState({alert: true})} ><span className="glyphicon glyphicon-trash" ></span>Delete</button>*/}
                    <button type="button" className="btn btn-default" onClick={this.goBack.bind(this)}><span className="glyphicon glyphicon-remove"></span>Cancel</button>
                    <a href="#" className="btn btn-success" onClick={this.publish.bind(this)}>
                        {this.state.busy ? loading : <span className="glyphicon glyphicon-open" />}
                       Publish</a>
                       <br /><br /><br /><br />
                </div>
            </div>
            {this.state.alert && <Modal  onCancel={() => this.setState({alert: false})}
                                         onOk={this.deleteHandler.bind(this)}/>}
        </div>);
    }

    goBack() {
        parent.postMessage(JSON.stringify({
            "followLink": `https://core.wrioos.com`
        }), "*");
    }

    deleteHandler () {
        this.setState({alert: false});
        this.props.onDelete(this.fileSavePattern());
    }
}

PostSettings.propTypes = {
    saveUrl: React.PropTypes.string,
    description: React.PropTypes.string,
    onPublish: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    commentID:React.PropTypes.string,
    author:React.PropTypes.string
};

class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentDidMount() {
        $('#confirm-delete').show();
    }

    onOk () {
        this.props.onOk();
        $('#confirm-delete').hide();
    }

    onCancel() {
        $('#confirm-delete').hide();
        this.props.onCancel();
    }

    render() {
        return (<div className="modal" id="confirm-delete" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Delete</h4>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to delete?
                    </div>
                    <div className="modal-footer">
                        <a className="btn btn-danger btn-ok" onClick={this.onOk}><span className="glyphicon glyphicon-trash" ></span>Delete</a>
                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.onCancel}><span className="glyphicon glyphicon-remove"></span>Cancel</button>
                    </div>
                </div>
            </div>
        </div>);
    }
}

Modal.propTypes = {
    onOk: React.PropTypes.func,
    onCancel: React.PropTypes.func
};
