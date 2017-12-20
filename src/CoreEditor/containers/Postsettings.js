/**
 * Created by michbil on 19.11.16.
 */

import React from 'react';
import { connect } from 'react-redux';
import { parseEditingUrl } from '../utils/url.js';
import * as pubAct from '../actions/publishActions';
import PostSettings from '../components/PostSettings';

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
    busy: publish.busy,
    commentsEnabled: publish.commentsEnabled,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onEditText: text => dispatch(pubAct.filenameChanged(text)),
    onEditDescription: text => dispatch(pubAct.descChanged(text)),
    onPublish: doc => dispatch(pubAct.publishWrapper(doc)),
    onDelete: () => dispatch(pubAct.deleteDocument()),
    onEnableComments: v => dispatch(pubAct.enableComments(v)),
    onPickSaveSource: v => dispatch(pubAct.pickSaveSource(v)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostSettings);
