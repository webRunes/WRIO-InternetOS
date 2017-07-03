/**
 * Created by michbil on 30.06.17.
 */

import React from 'react';
import {Tab,Tabs, Row, Col, Nav, NavItem} from 'react-bootstrap'
import Externals from './Externals'

const ArticleTabs = ({center,externals}) => {
    const handleSelect = (e) => console.log(e);
    const externalsDisabled = externals.length == 0;
    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="home">
            <Row className="card card-nav-tabs">
                <div className="header header-primary">
                    <div className="nav-tabs-navigation">
                        <div className="nav-tabs-wrapper">
                            <Nav bsStyle="tabs">
                                <NavItem eventKey="home" >

                                    Home
                                    <div className="ripple-container"></div>
                                </NavItem>
                                <NavItem eventKey="collections" disabled={externalsDisabled} className={externalsDisabled ? "disabled": "" }>
                                    Collections
                                    <div className="ripple-container"></div>
                                </NavItem>
                                <NavItem eventKey="ReadLater">
                                    Read later <label>4</label>
                                    <div className="ripple-container"></div>
                                </NavItem>
                            </Nav>
                        </div>
                    </div>
                </div>


                <Tab.Content animation className="card-content">
                    <Tab.Pane eventKey="home">
                        {center}
                    </Tab.Pane>
                    <Tab.Pane eventKey="collections">
                        <Externals data={externals}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="ReadLater">
                        Tab 2 content
                    </Tab.Pane>
                </Tab.Content>
            </Row>
        </Tab.Container>);


};

export default ArticleTabs