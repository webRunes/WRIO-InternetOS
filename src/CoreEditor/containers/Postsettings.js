/**
 * Created by michbil on 19.11.16.
 */

import React from "react";
import { parseEditingUrl } from "../utils/url.js";
import CommentEnabler from "../components/CommentEnabler.js";
import Modal from "../components/Modal";
import {
  Radio,
  FormGroup,
  CheckBox,
  DropdownButton,
  MenuItem
} from "react-bootstrap";
import PropTypes from "prop-types";

const WillBeLive = props => {
  return (
    <div className="form-group">
      <label className="col-xs-12 col-sm-4 col-md-3 control-label hidden-xs">
        &nbsp;
      </label>
      <div className="col-xs-12 col-sm-8 col-md-9">
        <div>Your page will be live at {props.savePath}</div>
      </div>
    </div>
  );
};
WillBeLive.propTypes = {
  savePath: PropTypes.string
};

const MAX_LENGTH = 515;

class PostSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  setSource(src) {
    this.source = src;
    this.setState({
      dropdownSource: this.dropdownSources[src]
    });
  }

  genDropdownSource(name) {
    const active = this.state.dropdownSource == this.dropdownSources[name];
    return (
      <li>
        <a href="#" onClick={() => this.setSource(name)}>
          {active && <span className="glyphicon glyphicon-ok pull-right" />}
          {this.dropdownSources[name]}
        </a>
      </li>
    );
  }

  render() {
    const loading = (
      <img
        src="https://default.wrioos.com/img/loading.gif"
        style={{ color: "red", margin: "0 4px 0" }}
      />
    );
    const exceedLength = this.props.description.length == MAX_LENGTH;

    const className = "form-group" + (exceedLength ? " has-error" : "");
    return (
      <div>
        {false && (
          <div className={className}>
            <label
              htmlFor="id-Description"
              className="col-sm-4 col-md-3 control-label"
            >
              Description
            </label>
            <div className="col-sm-8 col-md-9">
              <textarea
                className="form-control"
                type="text"
                maxLength="512"
                cols="40"
                rows="6"
                placeholder={`Optional. Max ${MAX_LENGTH} characters`}
                value={this.props.description}
                onChange={e => this.props.onEditDescription(e.target.value)}
              />
              <div className="help-block">
                {exceedLength && <span>Max {MAX_LENGTH} characters</span>}
              </div>
            </div>
          </div>
        )}

        <div className={className}>
          <label className="col-sm-4 col-md-3 control-label">
            Save Destination
          </label>
          <FormGroup bsClass="col-sm-8 col-md-9">
            <Radio
              bsClass="toggleButton"
              name="source"
              checked={this.props.saveSource == "S3"}
              onClick={() => this.props.onPickSaveSource("S3")}
            >
              WRIO OS
            </Radio>{" "}
            <Radio
              bsClass="toggleButton"
              name="source"
              checked={this.props.saveSource == "saveas"}
              onClick={() => this.props.onPickSaveSource("saveas")}
            >
              Save As...
            </Radio>
          </FormGroup>
        </div>
        {this.props.createMode && (
          <div className={className}>
            <label className="col-sm-4 col-md-3 control-label">File name</label>
            <div className="col-sm-8 col-md-9">
              <input
                type="text"
                className="form-control"
                id="File-name"
                placeholder="Untitled"
                value={this.props.saveFile}
                onChange={e => this.props.onEditText(e.target.value)}
              />
              <WillBeLive savePath={this.props.saveUrl} />
            </div>
          </div>
        )}

        <CommentEnabler
          isChecked={this.props.commentsEnabled}
          onCheck={this.props.onEnableComments}
        />
        <div className="col-xs-12">
          <div className="pull-right">
            {/* -Temp delete removing-!createMode() &&
                    <button type="button" className="btn btn-danger" onClick={() => this.setState({alert: true})} ><span className="glyphicon glyphicon-trash" ></span>Delete</button>*/}
            <button
              type="button"
              className="btn btn-default"
              onClick={this.goBack.bind(this)}
            >
              <span className="glyphicon glyphicon-remove" />Cancel
            </button>
            <DropdownButton title="Dropdown" id="bg-vertical-dropdown-1">
              <MenuItem eventKey="1">Publish</MenuItem>
              <MenuItem eventKey="2">SaveAs</MenuItem>
            </DropdownButton>
            <a
              href="#"
              className="btn btn-success"
              onClick={this.props.onPublish}
            >
              {this.props.busy ? (
                loading
              ) : (
                <span className="glyphicon glyphicon-open" />
              )}
              Publish
            </a>
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
        {this.props.alert && (
          <Modal
            onCancel={() => this.setState({ alert: false })}
            onOk={this.deleteHandler.bind(this)}
          />
        )}
      </div>
    );
  }

  goBack() {
    parent.postMessage(
      JSON.stringify({
        followLink: `https://core.wrioos.com`
      }),
      "*"
    );
  }
}

PostSettings.propTypes = {
  saveUrl: PropTypes.string,
  description: PropTypes.string,
  onPublish: PropTypes.func,
  onDelete: PropTypes.func,
  commentID: PropTypes.string,
  author: PropTypes.string
};

import { connect } from "react-redux";
import * as pubAct from "../actions/publishActions";

function mapStateToProps(state) {
  const { publish } = state;

  return {
    createMode: publish.editParams.createMode,
    saveSource: publish.saveSource,
    saveUrl: publish.saveUrl,
    saveFile: publish.filename,
    description: publish.description,
    commentID: publish.commentId,
    author: publish.author,
    busy: publish.busy
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onEditText: text => dispatch(pubAct.filenameChanged(text)),
    onEditDescription: text => dispatch(pubAct.descChanged(text)),
    onPublish: doc => dispatch(pubAct.publishDocument(doc)),
    onDelete: () => dispatch(pubAct.deleteDocument()),
    onEnableComments: v => dispatch(pubAct.enableComments(v)),
    onPickSaveSource: v => dispatch(pubAct.pickSaveSource(v))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostSettings);
