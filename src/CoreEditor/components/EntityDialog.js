import React from 'react';
import Modal from 'react-modal';
import Loading from 'base/components/misc/Loading';
import { Field, reduxForm } from 'redux-form';

const EntityDialog = ({ children, showDialog, ...restProps }) => (
  <div style={styles.linkTitleInputContainer}>
    <Modal shouldCloseOnOverlayClick style={customStyles} isOpen={showDialog} contentLabel="Edit">
      {showDialog && <EntityForm {...restProps} />}
    </Modal>
  </div>
);

const EntityForm = ({
  linkEntityKey,
  previewBusy,

  showTitle, // customize settings
  showDescription, // customize settings
  showImage,

  onUrlChanged,
  onRemoveLink,
  onCancelLink,
  handleSubmit,
}) => {
  const isEditLink = linkEntityKey != null;
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="linkUrl">URL: </label>
        <Field name="url" type="text" className="form-control" component="input" />
        {previewBusy && <Loading />}
      </div>
      {showTitle && (
        <div className="form-group">
          <label htmlFor="linkTitle">Title: </label>
          <Field
            name="title"
            component="input"
            style={styles.linkTitleInput}
            type="text"
            className="form-control"
          />
        </div>
      )}
      {showDescription && (
        <div className="form-group">
          <label htmlFor="linkDesc">Description: </label>
          <Field
            component="textarea"
            name="description"
            type="text"
            rows="4"
            className="form-control"
          />
        </div>
      )}
      {showImage && (
        <div className="form-group">
          <label htmlFor="linkDesc">Image: </label>
          <Field component="input" name="image" type="text" className="form-control" />
        </div>
      )}
      <div className="form-group pull-right">
        {isEditLink ? (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={e => onRemoveLink(linkEntityKey)}
          >
            <span className="glyphicon glyphicon-trash with_text" />Remove
          </button>
        ) : null}
        <button type="button" className="btn btn-default btn-sm" onClick={onCancelLink}>
          <span className="glyphicon glyphicon-remove with_text" />Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          <span className="glyphicon glyphicon-ok with_text" />Submit
        </button>
      </div>
    </form>
  );
};

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    zIndex: 140,
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
export default EntityDialog;
