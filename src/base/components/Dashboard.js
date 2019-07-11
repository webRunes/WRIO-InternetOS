import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-awesome-modal';

export class Dashboard extends React.Component {

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
    return (<div>
            <section>
                <Modal visible={this.state.visible} width="600" height="300" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="dashboard-modal-div">
                        <h4>The functionality is available to Alpha testers only.</h4>
                        <p >Press "Connect" on WRIO IoT Gateway to connect a new device, or enter the IPv6 address and AES key manually. For more information check manual inside the box.</p>
                        <p >IPv6 &nbsp; &nbsp; &nbsp;&nbsp;<input type="text"  size="35"/></p>
                        <p >AES key <input type="text" size="35"/></p>
                        <a className="btn btn-default dashboard-modal-div-a1" href="javascript:void(0);" onClick={() => this.closeModal()}>Cancel</a>
                        <a data-toggle="tooltip" data-placement="top" title="Available to Alpha testers only." className="btn btn-success dashboard-modal-div-a2">Submit</a>
                    </div>
                </Modal>
                </section>
        <div className="callout warning col-xs-12">
          <h5>Dasboard is under development and the functionality is limited. Premium features are available to alpha-testers only.</h5>
        </div>
        <button type="button" className="btn btn-success" onClick={() => this.openModal()}><span className="glyphicon glyphicon-plus with_text"></span>Add New Device</button>
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
                    <td><div className="dashboard-sensor-id" data-toggle="tooltip" data-placement="top" title={sensorProductData.productID}>{sensorProductData.productID}</div></td>
                    <td><a href={sensor.url.slice(0, sensor.url.length-10)}>{sensorProductData.name}</a></td>
                    <td className="center">{sensorDataFeed[0].item.variableMeasured.value.toLowerCase() == 'enabled' ? <span className="glyphicon glyphicon-ok-sign icon-success" data-toggle="tooltip" data-placement="top" title="Enabled"></span> : <span className="glyphicon glyphicon-remove-sign" data-toggle="tooltip" data-placement="top" title="Disabled"></span>}</td>
                    <td>Read</td>
                    <td>{sensorPayload.dateModified}</td>
                    <td>{sensorDataFeed[1].item.variableMeasured.value} &#8451;</td>
                    <td>{sensorDataFeed[2].item.variableMeasured.value} &#37;</td>
                  </tr>)

                }) : null
            }
          </tbody>
        </table>
    </div>)
  }
}
