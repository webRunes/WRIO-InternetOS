import React from 'react';
import { parseEditingUrl } from '../utils/url.js';
import CommentEnabler from './CommentEnabler.js';
import Modal from '../components/Modal';
import {
  Radio,
  FormGroup,
  CheckBox,
  Button,
  ButtonGroup,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';
import PropTypes from 'prop-types';

const WillBeLive = props => (
  <div className="form-group">
    <label className="col-xs-12 col-sm-4 col-md-3 control-label hidden-xs">&nbsp;</label>
    <div className="col-xs-12 col-sm-8 col-md-9">
      <div>Your page will be live at {props.savePath}</div>
    </div>
  </div>
);
WillBeLive.propTypes = {
  savePath: PropTypes.string,
};

const MAX_LENGTH = 515;

const goBack = function goBack() {
  window.history.back();
};

export default class PostSettings extends React.Component {
  render() {
    const loading = (
      <img
        src="https://default.wrioos.com/img/loading.gif"
        alt="loading"
        style={{
          color: 'red',
          margin: '0 4px 0',
          height: '10px',
          width: '16px',
        }}
      />
    );
    const exceedLength = this.props.description.length === MAX_LENGTH;

    const className = `form-group${exceedLength ? ' has-error' : ''}`;
    return (
      <div>
        <div className="core card-content col-xs-12">
          {this.props.createMode && (
            <div className={className + ' clearfix'}>
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
              </div>
            </div>
          )}
          <div className="form-group clearfix">
            <label className="col-sm-4 col-md-3 control-label">Comments</label>
            <CommentEnabler
              isChecked={this.props.commentsEnabled}
              onCheck={this.props.onEnableComments}
            />
          </div>
          <div className="form-group col-xs-12">
            <div className="navbar-right">
              <button type="button" className="btn btn-default" onClick={goBack}>
                <span className="glyphicon glyphicon-remove with_text" />Cancel
              </button>
              <ButtonGroup>
                <Button onClick={() => this.props.onPublish('S3')} bsStyle="success">
                  {' '}
                  {this.props.busy ? loading : <span className="glyphicon glyphicon-open with_text" />}
                  Publish
                </Button>
                <DropdownButton
                  bsStyle="success narrow-dropdown"
                  title=""
                  id="bg-vertical-dropdown-1"
                 
                >
                  <MenuItem eventKey="1"  onClick={() => this.props.onPublish('saveas')}>SaveAs</MenuItem>
                </DropdownButton>
              </ButtonGroup>
            </div>
          </div>
        </div>
        {this.props.alert && (
          <Modal onCancel={() => this.setState({ alert: false })} onOk={() => this.deleteHandler} />
        )}
      </div>
    );
  }
}

PostSettings.propTypes = {
  saveUrl: PropTypes.string,
  description: PropTypes.string,
  onPublish: PropTypes.func,
  onDelete: PropTypes.func,
  commentID: PropTypes.string,
  author: PropTypes.string,
  alert: PropTypes.bool,
};
