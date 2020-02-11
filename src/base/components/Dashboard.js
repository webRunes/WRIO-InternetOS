import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-awesome-modal';
import { Field, reduxForm } from 'redux-form';
import Tooltip from 'react-tooltip-lite';
import { MapBoxGl } from './mapbox/mapboxV2.js';
import { Dropdown,DropdownButton,ButtonToolbar, MenuItem, Glyphicon } from 'react-bootstrap';


class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible : false,
      isActiveOne: true,
      isActiveTwo: false,
      isActiveThree: false
  }
  }

  openModal() {
    this.setState({
        visible : true
    });
}

closeModal() {
    this.setState({
        visible : false
    });
}





  render() {
    let sensorData = this.props.sensorData;
    console.log(sensorData);
    console.log("sensorData");
    sensorData.sort((obj1, obj2) => {
      if ( obj1.productData.name < obj2.productData.name ){
        return -1;
      }
      if ( obj1.productData.name > obj2.productData.name ){
        return 1;
      }
      return 0;
    })

    return (<div className="dashboard-main">
        <Modal visible={this.state.visible} width="600" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
            <div className="dashboard-modal-div">
              <form>
                <div className="callout warning col-xs-12"><h5>The functionality is available to Alpha testers only.</h5></div>
                <p>Press "Connect" on the WRIO IoT Gateway to register a new device, or enter the IPv6 address and AES key manually. For more information check manual inside the box.</p>
                <div className="form-group">
                  <label htmlFor="IPv6_address">IPv6 address:</label>
                  <input name="IPv6_address" type="text" className="form-control"/>
                  {/* <Field name="IPv6_address" type="text" className="form-control" component="input" /> */}
                </div>
                <div className="form-group">
                  <label htmlFor="AES_key">AES key:</label>
                  <input name="AES_key" type="text" className="form-control"/>
                  {/* <Field name="AES_key" type="text" className="form-control" component="input" /> */}
                </div>
                <div className="form-group pull-right">
                  <button type="button" className="btn btn-default btn-sm" onClick={() => this.closeModal()}><span className="glyphicon glyphicon-remove with_text"></span>Cancel</button>
                  <Tooltip content="Available to Alpha testers only">
                    <button type="submit" disabled="disabled" className="btn btn-primary btn-sm"><span className="glyphicon glyphicon-ok with_text"></span>Submit</button>
                  </Tooltip>
                </div>
              </form>
            </div>
        </Modal>
        <div className="callout warning col-xs-12">         
            <h5>Dasboard is under development and the functionality is limited. Premium features are available to Alpha testers only.</h5>
          </div>

        <div className="row">
          <div className="control-left control-panel col-sm-6">
            <h1><i className="material-icons">group</i>Followers</h1>
            <p>8<sup>+2<span className="glyphicon glyphicon-arrow-up"></span></sup></p>
            <Tooltip className="tooltip-b" content="Available to Alpha testers only"><button className="btn btn-sm disabled">Follow</button></Tooltip>          </div>
          <div className="control-right control-panel col-sm-6">
            <h1><i className="material-icons">bar_chart</i>Analytics</h1>
            <p>Total devices: 17</p>
            <Tooltip className="tooltip-b" content="Premium feature, available to Alpha testers only"><button className="btn btn-sm disabled">Details</button></Tooltip>          </div>
        </div>

      <div className="row"><div className="col-xs-12">
        <ul className="nav nav-pills tab_networks">
          <li role="presentation" className={this.state.isActiveOne ? "active" : ""}><a href="" data-toggle="tab" onClick={e => {
            e.preventDefault();
            this.setState({ isActiveOne: true, isActiveTwo: false, isActiveThree: false })
            return false;
          }
          }>Testbed network</a></li>
          <li role="presentation" className={this.state.isActiveTwo ? "active" : ""}><a href="" data-toggle="tab" onClick={e => {
            e.preventDefault();
            this.setState({ isActiveOne: false, isActiveTwo: true, isActiveThree: false })
            return false;
          }
          }>Private test network</a></li>
          <li role="presentation" className={this.state.isActiveThree ? "active" : ""}><a href="" data-toggle="tab" className="add_icon" onClick={e => {
            e.preventDefault();
            this.setState({ isActiveOne: false, isActiveTwo: false, isActiveThree: true })
            return false;
          }
          }><i className="material-icons">add</i></a></li>
        </ul>
      </div>
      </div>
        <div className="tab-content clearfix">
        <div className={this.state.isActiveOne ? "tab-pane active": "tab-pane"} id="">
        <div className="row">
          <div className="col-xs-6">
            <button type="button" className="btn btn-success" onClick={() => this.openModal()}><span className="glyphicon glyphicon-plus with_text"></span>Add New Device</button>
          </div>
          <div className="col-xs-6 search">
            <input type="text" disabled className="form-control" placeholder="Search..." data-toggle="tooltip" data-placement="top" title="Available to Alpha testers only"/>
          </div>
        </div>

        <div className="dashboard-table">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Node name</th>
                <th>State</th>
                <th>Access</th>
                <th>Last seen</th>
                <th>Sensors</th>
                <th>Battery</th>
              </tr>
            </thead>
            <tbody>
              {
                sensorData.length > 0 ?
                  sensorData.map((sensor, index) => {
                    let sensorPayload = sensor.payload;
                    let sensorProductData = sensor.productData;
                    let sensorDateModified = sensor.payload.dateModified;
                    let temperatureData    = sensor.payload.dataFeedElement.find(item => item.item.variableMeasured
                          .name.toLowerCase() == 'temperature');
                    let batteryData        =    sensor.payload.dataFeedElement.find(item => item.item.variableMeasured
                          .name.toLowerCase() == 'battery')   
                    let stateData = sensor.payload.dataFeedElement.find(item => item.item.variableMeasured
                        .name.toLowerCase() == 'state')
                    let lastIndex = sensorDateModified.length - 1;
                    let dropDownItems = sensor.payload.dataFeedElement.filter(item => (item.item.variableMeasured
                          .name.toLowerCase() != 'battery') && (item.item.variableMeasured
                          .name.toLowerCase() != 'state'));
                    let datadesc = dropDownItems ? dropDownItems.map((item,index)=>
                          item.item.variableMeasured.name=='temperature'?item.item.variableMeasured.name[0].toUpperCase() + item.item.variableMeasured.name.slice(1)+": "
                          +item.item.variableMeasured.value[lastIndex] + " °C":
                          item.item.variableMeasured.name[0].toUpperCase() + item.item.variableMeasured.name.slice(1)+": "
                          +item.item.variableMeasured.value[lastIndex]):
                          temperatureData.item.variableMeasured.value[lastIndex];
                    let datadesclist = datadesc.toString().split(",").join("  \n ");
                    let checkEnable  = stateData.item.variableMeasured.value[lastIndex].toLowerCase();
                    let currentCordinate = this.props.geoCoordinates.filter(item => item.feedUrl == sensor.url);
                    let sensorProductName = sensorProductData.name;    
                   return (
                        <tr  onClick={() => MapBoxGl.mapOnClick(this.props.geoCoordinates,currentCordinate,datadesc,sensorProductName,checkEnable)}>
                        <td> <Tooltip content={sensorProductData.productID}><div className="dashboard-sensor-id">{sensorProductData.productID}</div></Tooltip></td>
                        <td><a href={sensor.url.substring(0, sensor.url.length - 5)}>{sensorProductData.name}</a></td>
                        <td className="center">
                        {stateData.item.variableMeasured.value[lastIndex].toLowerCase() == 'enable' ?  <Tooltip content="Enabled">
                          <span className="glyphicon glyphicon-ok-sign icon-success"></span></Tooltip> : <Tooltip content="Disabled">
                          <span className="glyphicon glyphicon-remove-sign"></span></Tooltip> }
                        </td>
                        <td>Read</td>
                        <td>{sensorDateModified[lastIndex]}</td>
                        {dropDownItems.length > 1 ? (
                            <td>{dropDownItems.length}
                              <a href={sensor.url}>
                                <Tooltip className="tooltip-b" direction="up-start" content={<div style={{ whiteSpace: 'pre-line' }}>
                                  <b>Last Readings</b><br /><hr />{datadesclist}</div> }><span className="glyphicon glyphicon-stats" />
                                </Tooltip>
                              </a>
                            </td>
                          ) : (
                              <td>
                                {dropDownItems.length}
                                <a href={sensor.url}>
                                  <Tooltip className="tooltip-b" direction="up-start" content={ <div>
                                        <b>Last Readings</b> <br /> <hr />{datadesc}</div> }><span className="glyphicon glyphicon-stats" />
                                  </Tooltip>
                                </a>
                              </td>
                            )}
                        <td>{batteryData.item.variableMeasured.value[lastIndex]} V</td>
                      </tr>
                    )
                  }) : null
              }
            </tbody>
          </table>
        </div>
          <div className="row">
            <div className="col-sm-6">
              <span className="data_entries" role="status" aria-live="polite">Showing 1 to 4 of 4 entries</span>
            </div>
            <div className="col-sm-6">
              <nav aria-label="Pagination">
                <ul className="pagination pull-right">
                  <li className="page-item disabled">
                    <a className="page-link" href="#" tabindex="-1">Previous</a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#">1 <span className="sr-only">(current)</span></a>
                  </li>
                  <li className="page-item disabled">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
        </div>
        <MapBoxGl geoCoordinates={this.props.geoCoordinates}/>
        </div>
        
        <div className={this.state.isActiveTwo ? "tab-pane active": "tab-pane"} id="">
          <div className="row">
            <div className="col-sm-12">
              <div className="jumbotron">
                <h2>A private network</h2>
                <p>This is a private IoT network. You need to gain access rights from the network provider.</p>
                <p><Tooltip className="tooltip-b" content="Available to Alpha testers only"><button className="btn disabled">Get access</button></Tooltip></p>
              </div>
            </div>
          </div>
        </div>
        <div className={this.state.isActiveThree ? "tab-pane active": "tab-pane"} id="">
          <div className="row">
            <div className="col-sm-12">
              <div className="jumbotron">
                <h2>Create a new network</h2>
                <p>You are not a member of the provider's network. To get access you need to join the network.</p>
                <p><Tooltip className="tooltip-b" content="Available to Alpha testers only"><button className="btn disabled">Join the network</button></Tooltip></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

export default Dashboard;
