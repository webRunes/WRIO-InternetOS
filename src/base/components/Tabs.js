/**
 * Created by michbil on 30.06.17.
 */

import React from 'react';
import {Tab,Tabs, Row, Col, Nav, NavItem} from 'react-bootstrap'
import Externals from './Externals'
import Core from './widgets/Core'
import ReadItLater from './ReadItLater'
import Actions from '../actions/WrioDocument'

const ArticleTabs = ({center,externals,editAllowed,RIL,tabKey}) => {
    const handleSelect = (e) => console.log(e);
    const externalsDisabled = externals.length == 0;
    return (
        <Tab.Container id="left-tabs-example"
                       defaultActiveKey="home"
                       activeKey={tabKey}
                       onSelect={(key) => Actions.tabClick(key)}
        >
            <Row className="card card-nav-tabs">
                <div className="header header-primary">
                    <div className="nav-tabs-navigation">
                        <div className="nav-tabs-wrapper">
                            <Nav bsStyle="tabs">
                                <NavItem eventKey="home" >

                                    Home
                                    <div className="ripple-container"></div>
                                </NavItem>
                                {editAllowed && <NavItem eventKey="edit">
                                    <i className="material-icons">edit</i>Edit
                                    <div className="ripple-container"></div>
                                </NavItem>}

                                {(!externalsDisabled) && <NavItem eventKey="collections" disabled={externalsDisabled} className={externalsDisabled ? "disabled": "" }>
                                    Collections
                                    <div className="ripple-container"></div>
                                </NavItem>}
                                {(RIL && (RIL.length > 0)) && <NavItem eventKey="ReadLater">
                                    Read later <label>{RIL.length}</label>
                                    <div className="ripple-container"></div>
                                </NavItem>}
                            </Nav>
                        </div>
                    </div>
                </div>


                <Tab.Content animation className="card-content">
                    <Tab.Pane eventKey="home">
                        {center}
                    </Tab.Pane>
                    {editAllowed && <Tab.Pane eventKey="edit">
                        <Core article={window.location.href}/>
                    </Tab.Pane>}
                    <Tab.Pane eventKey="collections">
                        <Externals data={externals}/>
                    </Tab.Pane>
                    {(RIL && (RIL.length > 0)) && <Tab.Pane eventKey="ReadLater">
                        <ReadItLater RIL={RIL}/>
                    </Tab.Pane>}
                </Tab.Content>
            </Row>
        </Tab.Container>);


};

export default ArticleTabs