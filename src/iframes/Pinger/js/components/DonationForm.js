/**
 * Created by michbil on 26.05.17.
 */

import React from "react";
import FormActions from "../actions/formactions.js";
import { COMMENT_LENGTH, TITLE_LENGTH } from "../constants.js";

export default class DonationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  titleChanged() {
    const title = this.refs.title.value;
    FormActions.tagsChanged(title);
  }

  commentChanged() {
    const comment = this.refs.comment.value;
    FormActions.commentChanged(comment);
  }

  filterKeys(e) {
    return e.key === 'Enter'
      ? e.preventDefault() && false
      : true
  }

  filterInputKeys(e) {
    return e.key === '#' && e.nativeEvent.target.value.indexOf('#') >= 0
      ? e.preventDefault() && false
      : true
  }

  render() {
    const insuffientFunds = this.props.amount > this.props.balance;
    const hasError = insuffientFunds ? "has-error" : "";
    const hasPhoto = this.props.hasPhoto;

    return (
      <div>
        <div
          className={`form-group send-comment-form-donation donation-form col-xs-12 col-sm-6 col-md-4 col-lg-3 ${hasError}`}
        >
          <div className="input-group input-group-sm tooltip-demo">
            <span className="input-group-addon">Send</span>
            <input
              type="number"
              className="form-control"
              ref="inputAmount"
              value={this.props.amount}
              min="0"
              disabled={this.props.donateDisabled}
              onChange={() =>
                FormActions.amountChanged(this.refs.inputAmount.value)}
            />
            <span className="input-group-addon">CRD</span>
          </div>

          {insuffientFunds && (
            <div className="help-block">
              <span>Insufficient funds</span>
            </div>
          )}
        </div>
        <div className="form-group send-comment-form-donation col-xs-12 col-sm-6 col-md-4 col-lg-7">
          <div className="input-group input-group-sm">
            <span className="input-group-addon twitter-limit">
              {this.props.left.title}
            </span>
            <input
              ref="title"
              name="tweet_title"
              className="form-control"
              maxLength={TITLE_LENGTH}
              placeholder="Title, URL, one #hashtag or @mention"
              type="text"
              value={this.props.tags}
              onKeyPress={this.filterInputKeys}
              onChange={() => this.titleChanged()}
            />
          </div>
        </div>

        <div className="form-group send-comment-form col-xs-12">
          {hasPhoto
              ? (<div className="well">
                   <h4>Success!</h4>
                   <p>The photo has been uploaded</p>
                 </div>)
              : (<textarea
                   maxLength={COMMENT_LENGTH}
                   rows="3"
                   className="form-control"
                   placeholder={`Let us know your thoughts! Max ${COMMENT_LENGTH} characters`}
                   name="comment"
                   ref="comment"
                   value={this.props.comment}
                   onKeyPress={this.filterKeys}
                   onChange={() => this.commentChanged()}
                 />)
          }
        </div>
      </div>
    );
  }
}
