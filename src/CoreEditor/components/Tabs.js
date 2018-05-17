import React from 'react';
import { Tab, Tabs, Row, Col, Nav, NavItem, Button, NavDropdown, MenuItem } from 'react-bootstrap';
import Externals from '../../base/components/Externals';
import ReadItLater from '../../base/components/ReadItLater';
import { StayOnTopElement } from './utils/domutils';
import {
  pageEltHt,
  scrollTop,
  addClass,
  removeClass,
  getElementDimensions,
} from './utils/domutils';
import { findDOMNode } from 'react-dom';
import EditExternal from 'CoreEditor/containers/EditExternal';
const isProfileUrl = require('./utils/is_profile_url');
const changeUrlsToUrlsForEdit = require('./utils/change_urls_to_urls_for_edit');

const HEADER_PADDING = 15; // variable set in CSS

class ArticleTabs extends StayOnTopElement {
  handleScroll() {
    const elem = this.refs.subcontainer;
    const container = findDOMNode(this.refs.container); // THIS IS WRONG! figure out how to use ref instead
    const offset = getElementDimensions(container).top;

    const sz1 = offset - 30;
    const sz2 = scrollTop();
    //    console.log(`${sz1} <= ${sz2}`);
    if (sz1 <= sz2) {
      addClass(elem, 'tabbar-fixed-top');
      this.refs.placeholder.style.display = 'block';
      this.refs.placeholder.style.height =
        `${getElementDimensions(elem).height - HEADER_PADDING}px`;
      const wd = `${getElementDimensions(container).width - HEADER_PADDING * 2}px`;
      this.refs.subcontainer.style.width = wd;
    } else {
      removeClass(elem, 'tabbar-fixed-top');
      this.refs.placeholder.style.display = 'none';
      this.refs.subcontainer.style.width = 'auto';
    }
  }

  render() {
    const center = this.props.center,
      externals = this.props.externals,
      editAllowed = this.props.editAllowed,
      myList = changeUrlsToUrlsForEdit(this.props.myList),
      //RIL = this.props.RIL,
      tabKey = this.props.tabKey;

    const handleSelect = e => console.log(e);
    const externalsEnabled = this.props.forceExternals || externals.length > 0;
    return (
      <Tab.Container
        ref="container"
        id="container"
        defaultActiveKey="home"
        activeKey={tabKey}
        onSelect={key => this.props.tabClick(key)}
      >
        <Row className="card card-nav-tabs">
          <div className="header header-primary" ref="subcontainer" style={{ display: 'block' }}>
            <div className="nav-tabs-navigation">
              <div className="nav-tabs-wrapper">
                <Nav bsStyle="tabs">
                  <NavItem eventKey="home">
                    Home
                    <div className="ripple-container" />
                  </NavItem>

                  {!!myList && (
                    <NavDropdown title="edit" className="right">
                      {
                        myList.map((o, index) =>
                          <MenuItem href={o.url} key={index}>
                            <i className="material-icons dp_small with_text">bookmark</i>{isProfileUrl(o.url)
                              ? Profile
                              : o.name
                            }
                          </MenuItem>
                        )
                      }
                    </NavDropdown>
                  )}

                  {/*externalsEnabled && (
                    <NavItem
                      eventKey="collection"
                      disabled={!externalsEnabled}
                      className={!externalsEnabled ? 'disabled' : ''}
                    >
                      Collection
                      <div className="ripple-container" />
                    </NavItem>
                  )*/}
                  {/*
                    RIL && RIL.length > 0 && (
                      <NavItem eventKey="ReadLater">
                        Read later <label>{RIL.length}</label>
                        <div className="ripple-container" />
                      </NavItem>
                    )
                  */}
                </Nav>
              </div>
            </div>
          </div>

          <Tab.Content animation className="card-content">
            <div ref="placeholder" style={{ height: '30px' }} />
            <Tab.Pane eventKey="home">{center}</Tab.Pane>
            {!!myList && <Tab.Pane eventKey="edit" />}
            <Tab.Pane eventKey="collection">
              {this.props.editMode && <EditExternal />}
              {externals.map(data => <Externals data={data.blocks} />)}
            </Tab.Pane>
            {/*
              RIL &&
              RIL.length > 0 && (
                <Tab.Pane eventKey="ReadLater">
                  <ReadItLater RIL={RIL} />
                </Tab.Pane>
              )
            */}
          </Tab.Content>
        </Row>
      </Tab.Container>
    );
  }
}

export default ArticleTabs;
