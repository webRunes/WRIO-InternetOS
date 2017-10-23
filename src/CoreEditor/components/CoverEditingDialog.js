// @flow
import React from 'react';
import Modal from 'react-modal';

type CoverDialogTypes = {
  showDialog: boolean,
  onCloseDialog: Function,
};

const CoverDialog = ({ title, text, showDialog, onCloseDialog }: CoverDialogTypes) => {
  const urlValue = 'WTF';
  const previewBusy = false;
  const showTitle = false;
  const showDescription = false;
  return (
    <div style={styles.linkTitleInputContainer}>
      <Modal shouldCloseOnOverlayClick style={modalStyles} isOpen={showDialog} contentLabel="Edit">
        <div className="form-group">
          <label htmlFor="linkUrl">URL: </label>
          <input
            onChange={e => onUrlChange(e.target.value)}
            type="text"
            value={urlValue}
            className="form-control"
          />{' '}
          {previewBusy && <img src="https://default.wrioos.com/img/loading.gif" />}
        </div>
        {showTitle && (
          <div className="form-group">
            <label htmlFor="linkTitle">Title: </label>
            <input
              onChange={e => onTitleChange(e.target.value)}
              style={styles.linkTitleInput}
              type="text"
              value={titleValue}
              className="form-control"
            />
          </div>
        )}
        {showDescription && (
          <div className="form-group">
            <label htmlFor="linkDesc">Description: </label>
            <textarea
              onChange={e => onDescChange(e.target.value)}
              rows="4"
              type="text"
              value={descValue}
              className="form-control"
            />
          </div>
        )}
        <div className="form-group pull-right">
          <button className="btn btn-default btn-sm" onClick={onCloseDialog}>
            <span className="glyphicon glyphicon-remove" />Cancel
          </button>
          <button className="btn btn-primary btn-sm">
            <span className="glyphicon glyphicon-ok" />Submit
          </button>
        </div>
      </Modal>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    zIndex: 10,
  },
  content: {
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '380px',
    transform: 'translate(-50%, -50%)',
  },
};

const styles = {
  root: {
    fontFamily: "'Arial', serif",
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 10,
  },
  linkTitleInputContainer: {
    marginBottom: 10,
  },
  linkTitleInput: {
    fontFamily: "'Arial', serif",
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
};
export default CoverDialog;
