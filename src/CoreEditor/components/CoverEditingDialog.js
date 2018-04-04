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
    <Row className="card card-nav-tabs">
      <div className="header header-primary">
        <div className="nav-tabs-navigation">
          <div className="nav-tabs-wrapper">
            <Nav bsStyle="tabs">
              {tabs.map(tab => (<NavItem eventKey={tab.key} key={tab.key}>
                { tab.name }
                <div className="ripple-container" />
              </NavItem>))}
              <NavItem eventKey="new"><span class="glyphicon glyphicon-plus-sign"></span>
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
  return (
    <div style={styles.linkTitleInputContainer}>
      <Modal
        shouldCloseOnOverlayClick
        style={modalStyles}
        isOpen={showDialog}
        contentLabel="EditCover"
      >
        <CoverTabs
          tabs={tabs}
          activeTab={tab}
          onNewTab={onNewCover}
          onCoverTabChange={onCoverTabChange}
        >
          <div className="cover-edit" style={{ height: 'calc(100vh - 100px - 280px)'}}>
            <EditorComponent
              editorState={editorState}
              editorName="COVEREDITOR_"
              editorChanged={editorChanged}
              openImageDialog={openImageDialog}
              openLinkDialog={openLinkDialog}
            />
          </div>
          <div className="core">
            <div className="form-group">
              <label className="col-sm-4 col-md-3 control-label" htmlFor="linkUrl">Image URL</label>
              <div className="col-sm-8 col-md-9">
                <input
                  onChange={e => imageUrlChange(e.target.value)}
                  type="text"
                  value={imageUrl}
                  className="form-control"
                />{' '}
              </div>
              {previewBusy && (<Loading />)}
            </div>
            <div className="form-group col-xs-12">
              <div className="navbar-left">
                <button className="btn btn-danger" onClick={onCloseDialog}>
                  <span className="glyphicon glyphicon-trash with_text" />Remove
                </button>
              </div>
              <div className="navbar-right">
                <button className="btn btn-default" onClick={onCloseDialog}>
                  <span className="glyphicon glyphicon-remove with_text" />Cancel
                </button>
                <button className="btn btn-primary" onClick={() => onSaveCover(editorState, imageUrl)}>
                  <span className="glyphicon glyphicon-ok with_text" />Submit
                </button>
              </div>
            </div>
          </div>
        </CoverTabs>

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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 4,
  },
  content: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: 'none',
    background: '#00000000',
    overflow: 'initial !important',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '0px',
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
