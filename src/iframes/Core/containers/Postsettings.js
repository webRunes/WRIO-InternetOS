/**
 * Created by michbil on 19.11.16.
 */

import React from 'react';
import {parseEditingUrl} from '../utils/url.js';
import CommentEnabler from '../components/CommentEnabler.js';
import Modal from '../components/Modal'



const WillBeLive = (props) => {
    return (<div className="form-group">
        <label className="col-xs-12 col-sm-4 col-md-3 control-label hidden-xs">&nbsp;</label>
        <div className="col-xs-12 col-sm-8 col-md-9">
            <div>Your page will be live at {props.savePath}</div>
        </div>
    </div>);
};
WillBeLive.propTypes = {
    savePath:  React.PropTypes.string
};

const MAX_LENGTH = 515;

class PostSettings extends React.Component {
    constructor(props) {
        super(props);
        this.source = 'save';
        this.dropdownSources = {
            'save':"WRIO OS",
            "saveas":"Save as.."
        };
        const [editUrl, saveRelativePath] = parseEditingUrl();
        this.state = {
            dropdownSource: this.dropdownSources['save'],
            editUrl,
            saveRelativePath,
            busy: false,
            userStartedEditing: false,
            alert: false
        };
        Object.assign(this.state,this.applyDescription(props.description));
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
        if (value.length >= MAX_LENGTH) {
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


    genDropdownSource(name) {
        const active = this.state.dropdownSource == this.dropdownSources[name];
        return (<li>
            <a href="#" onClick={() => this.setSource(name)}>
                {active && <span className="glyphicon glyphicon-ok pull-right"></span>}
                {this.dropdownSources[name]}</a>
        </li>);
    }


    render () {
        const loading = <img src="https://default.wrioos.com/img/loading.gif" style={{color: "red",margin:"0 4px 0"}}  />;

        const className ="form-group" +  (this.state.exceedLength ? " has-error" : "");
        return (<div className="form-horizontal col-xs-12">
          <div className={className}>
            <label htmlFor="id-Description" className="col-sm-4 col-md-3 control-label">Description</label>
            <div className="col-sm-8 col-md-9">
              <textarea className="form-control" type="text" maxLength="512"
                cols="40"
                rows="6"
                placeholder="Optional. Max 512 characters"
                value={this.props.description}
                onChange={(e) => this.props.onEditDescription(e.target.value)} />
              <div className="help-block">
                {this.state.exceedLength && <span>Max {MAX_LENGTH} characters</span>}
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
           {this.props.createMode && <div className="col-xs-6 col-sm-4 col-md-5">
                  <input type="text"
                         className="form-control"
                         id="File-name"
                         placeholder="Untitled"
                         value={this.props.saveFile}
                         onChange={(e) => this.props.onEditText(e.target.value)}
                      />
              </div>}
          </div>
            <WillBeLive savePath={this.props.saveUrl} />
            <CommentEnabler isChecked={false}
                            onCheck={this.props.onEnableComments}
                            />
            <div className="col-xs-12">
                <div className="pull-right">
                    {/* -Temp delete removing-!createMode() &&
                    <button type="button" className="btn btn-danger" onClick={() => this.setState({alert: true})} ><span className="glyphicon glyphicon-trash" ></span>Delete</button>*/}
                    <button type="button" className="btn btn-default" onClick={this.goBack.bind(this)}><span className="glyphicon glyphicon-remove"></span>Cancel</button>
                    <a href="#" className="btn btn-success" onClick={this.props.onPublish}>
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

}

PostSettings.propTypes = {
    saveUrl: React.PropTypes.string,
    description: React.PropTypes.string,
    onPublish: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    commentID:React.PropTypes.string,
    author:React.PropTypes.string
};


import { connect } from 'react-redux'
import * as pubAct from '../actions/publishActions'

function mapStateToProps(state) {
    const {publish} = state;

    return {
        createMode: publish.editParams.createMode,
        saveUrl:publish.saveUrl,
        saveFile:publish.filename,
        description: publish.description,
        commentID: publish.commentId,
        author: publish.author
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onEditText: (text) => dispatch(pubAct.filenameChanged(text)),
        onEditDescription: (text) => dispatch(pubAct.descChanged(text)),
        onPublish: (doc) => dispatch(pubAct.publishDocument(doc)),
        onDelete: () => dispatch(pubAct.deleteDocument()),
        onEnableComments: (v) => dispatch(pubAct.enableComments(v))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PostSettings)