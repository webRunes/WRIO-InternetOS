import React from 'react';
import { connect } from "react-redux";

export class Dashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let sensorData = this.props.sensorData;
    return (<div>
        <div className="callout warning col-xs-12">
          <h5>Dasboard is under development and the functionality is limited. Premium features are available to alpha-testers only.</h5>
        </div>
        <button type="button" className="btn btn-success"><span class="glyphicon glyphicon-plus with_text"></span>Add New Device</button>
        <table class="table table-striped">
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
                    <td><div className="dashboard-sensor-id">{sensorProductData.productID}</div></td>
                    <td><a href={sensor.url.slice(0, sensor.url.length-10)}>{sensorProductData.name}</a></td>
                    <td className="center">{sensorDataFeed[0].item.variableMeasured.value.toLowerCase() == 'enabled' ? <span class="glyphicon glyphicon-ok-sign icon-success"></span> : <span class="glyphicon glyphicon-remove-sign"></span>}</td>
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
