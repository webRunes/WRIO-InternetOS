// @flow
import React from 'react';
import Modal from 'react-modal';
import EditorComponent from './EditorComponent';
import Loading from 'base/components/misc/Loading';

type CoverDialogTypes = {
  showDialog: boolean,
  onCloseDialog: Function,
};

const CoverDialog = ({
  editorState,
  imageUrl,imageUrlChange,
  showDialog,
  onSaveCover,
  onCloseDialog,
  editorChanged,
  openImageDialog,
  openLinkDialog,
}: 
CoverDialogTypes) => {
  const previewBusy = false;
  console.log("EDIT")
  return (
    <div style={styles.linkTitleInputContainer}>
      <Modal shouldCloseOnOverlayClick 
      style={modalStyles} 
      isOpen={showDialog} 
      contentLabel="Edit">
      <div style={{overflow:"scroll",height:"calc(100% - 110px)"}}>
        <EditorComponent
          editorState={editorState}
          editorName="COVEREDITOR_"
          editorChanged={editorChanged}
          openImageDialog={openImageDialog}
          openLinkDialog={openLinkDialog}
        />
        <div className="form-group">
          <label htmlFor="linkUrl">IMAGE URL: </label>
          <input
            onChange={e => imageUrlChange(e.target.value)}
            type="text"
            value={imageUrl}
            className="form-control"
          />{' '}
          {previewBusy && (
           <Loading />
          )}
        </div>
        </div>

        <div className="form-group" style={{height: "80px"}}>
          <button className="btn btn-default btn-sm" onClick={onCloseDialog}>
            <span className="glyphicon glyphicon-remove" />Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onSaveCover(editorState, imageUrl)}>
            <span className="glyphicon glyphicon-ok" />OK
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 100000,
  },
  content: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    height: '70%',
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
