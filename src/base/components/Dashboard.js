import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-awesome-modal';
import { Field, reduxForm } from 'redux-form';
import Tooltip from 'react-tooltip-lite';
import { MapBoxGl } from './mapbox/mapboxV2.js';
class DashboardPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible : false
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
    return (<div className="dashboard-main">
        <Modal visible={this.state.visible} width="600" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
            <div className="dashboard-modal-div">
              <form>
                <div className="callout warning col-xs-12"><h5>The functionality is available to Alpha testers only.</h5></div>
                <p>Press "Connect" on WRIO IoT Gateway to connect a new device, or enter the IPv6 address and AES key manually. For more information check manual inside the box.</p>
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
            <button className="btn btn-sm disabled">Follow</button>
          </div>
          <div className="control-right control-panel col-sm-6">
            <h1><i className="material-icons">bar_chart</i>Analytics</h1>
            <p>Total devices: 17</p>
            <button className="btn btn-sm disabled">Details</button>
          </div>
        </div>

        <div className="row"><div className="col-xs-12">
            <ul className="nav nav-pills tab_networks">
              <li role="presentation" className="active"><a href="#1a" onClick={e => e.stopPropagation()} data-toggle="tab">Testbed network</a></li>
              <li role="presentation"><a href="#1b" data-toggle="tab" onClick={e => e.stopPropagation()}>Private test network</a></li>
              <li role="presentation"><a href="#1c" data-toggle="tab" className="add_icon" onClick={e => e.stopPropagation()}><i className="material-icons">add</i></a></li>
            </ul>
          </div>
        </div>
        <div class="tab-content clearfix">
			  <div class="tab-pane active" id="1a">
        <div className="row">
          <div className="col-xs-6">
            <button type="button" className="btn btn-success" onClick={() => this.openModal()}><span className="glyphicon glyphicon-plus with_text"></span>Add New Device</button>
          </div>
          <div className="col-xs-6 search">
            <input type="text" disabled className="form-control" placeholder="Search..." data-toggle="tooltip" data-placement="top" title="Premium feature, available to Alpha testers only"/>
          </div>
        </div>

        <div className="dashboard-table">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>State</th>
                <th>Access</th>
                <th>Last seen</th>
                <th>Last readings</th>
                <th>Battery</th>
              </tr>
            </thead>
            <tbody>
              {
                sensorData.length > 0 ?
                  sensorData.map((sensor, index) => {
                    let sensorPayload = sensor.payload;
                    let sensorDataFeed = sensor.payload.dataFeedElement.slice(Math.max(sensor.payload.dataFeedElement.length - 3, 1));
                    let sensorProductData = sensor.productData;
                    return (<tr>
                      <td> <Tooltip content={sensorProductData.productID}><div className="dashboard-sensor-id">{sensorProductData.productID}</div></Tooltip></td>
                      <td><a href={sensor.url.slice(0, sensor.url.length-10)}>{sensorProductData.name}</a></td>
                      <td className="center">{sensorDataFeed[0].item.variableMeasured.value.toLowerCase() == 'enabled' ?  <Tooltip content="Enabled">
                      <span className="glyphicon glyphicon-ok-sign icon-success"></span></Tooltip> : <Tooltip content="Disabled">
                      <span className="glyphicon glyphicon-remove-sign"></span></Tooltip>}</td>
                      <td>Read</td>
                      <td>{sensorPayload.dateModified}</td>
                      <td>{sensorDataFeed[1].item.variableMeasured.name == 'temperature'? <span>{sensorDataFeed[1].item.variableMeasured.value}  &#8451;</span>:  (sensorDataFeed[1].item.variableMeasured.name == 'pressure'? <span>{sensorDataFeed[1].item.variableMeasured.value}  {'hPa'}</span>:<span>{sensorDataFeed[1].item.variableMeasured.value}</span>) }</td>
                      <td>{sensorDataFeed[2].item.variableMeasured.value} &#37;</td>
                    </tr>)
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
				<div class="tab-pane" id="1b">
          <h3>Private test network text here</h3>
				</div>
        <div class="tab-pane" id="1c">
          <h3>+ text here</h3>
				</div>
			</div>
    </div>)
  }
}

const mapStateToPropsMapBox = state => ({
  geoCoordinates: state.document.geoCoordinates
});

export const Dashboard = connect(mapStateToPropsMapBox)(DashboardPage);
