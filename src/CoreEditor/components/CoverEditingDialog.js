// @flow
import React from 'react';
import Modal from 'react-modal';
import { Tab, Tabs, Row, Col, Nav, NavItem, Button } from 'react-bootstrap';
import EditorComponent from './EditorComponent';
import Loading from 'base/components/misc/Loading';

type CoverDialogTypes = {
  showDialog: boolean,
  onCloseDialog: Function,
};

const CoverTabs = ({
  children, tabs, onNewTab, activeTab, onCoverTabChange,
}) => (<Tab.Container
  id="tabcontainer"
  defaultActiveKey="Cover1"
  activeKey={activeTab.key}
  onSelect={(key) => {
    if (key === 'new') {
        onNewTab();
      } else {
        onCoverTabChange(key);
      }
    }}
>
  <div style={{ marginLeft: 15, marginRight: 15 }}>
    <Row className="card">
      <div
        className="header header-primary"
      >
        <div className="nav-tabs-navigation">
          <div className="nav-tabs-wrapper">
            <Nav bsStyle="tabs">
              {tabs.map(tab => (<NavItem eventKey={tab.key} key={tab.key}>
                { tab.name }
                <div className="ripple-container" />
              </NavItem>))}
              <NavItem eventKey="new">+
                <div className="ripple-container" />
              </NavItem>
            </Nav>
          </div>
        </div>
      </div>

      <Tab.Content animation className="card-content">
        {children}
      </Tab.Content>
    </Row>
  </div>
</Tab.Container>);

const CoverDialog = ({
  editorState,
  imageUrl, imageUrlChange,
  showDialog,
  onSaveCover,
  onCloseDialog,
  editorChanged,
  openImageDialog,
  openLinkDialog,
  tabs,
  tab,
  onCoverTabChange,
  onCoverTabDelete,
  onNewCover,
}:
CoverDialogTypes) => {
  const previewBusy = false;
  console.log('EDIT');
  return (
    <div style={styles.linkTitleInputContainer}>
      <Modal
        shouldCloseOnOverlayClick
        style={modalStyles}
        isOpen={showDialog}
        contentLabel="Edit"
      >
        <div style={{ overflow: 'scroll', height: 'calc(100% - 110px)' }}>
          <CoverTabs
            tabs={tabs}
            activeTab={tab}
            onNewTab={onNewCover}
            onCoverTabChange={onCoverTabChange}
          >
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
          </CoverTabs>
        </div>

        <div className="form-group" style={{ height: '80px' }}>
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
