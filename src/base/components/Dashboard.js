import React from 'react';
import { connect } from "react-redux";

export class Dashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let sensorData = this.props.sensorData;
    return (<div>
      <span class="tool-tip" data-toggle="tooltip" data-placement="top" title="Coming">
        <button disabled="disabled" class="btn btn-default">Add New Device</button>
      </span>
      <div>
        <span class="tool-tip" data-toggle="tooltip" data-placement="top" title="Upgrade to premium. Coming">
          <button disabled="disabled" class="btn btn-default">Group Management</button>
        </span>
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="tableDefaultCheck1" disabled="true" />
              </div>
            </th>
            <th>ID </th>
            <th>Name </th>
            <th>State </th>
            <th>Last seen</th>
            <th>Last measurement</th>
            <th>Device battery</th>
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
                  <th scope="row">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id="tableDefaultCheck4" />
                    </div>
                  </th>
                  <td><div className="dashboard-sensor-id">{sensorProductData.productID}</div></td>
                  <td><a href={sensor.url.slice(0, sensor.url.length-10)}>{sensorProductData.name}</a></td>
                  <td>{sensorDataFeed[0].item.variableMeasured.value.toLowerCase() == 'enabled' ? <span class="glyphicon glyphicon-ok icon-success" style={{ color: 'green' }}></span> : <span class="glyphicon glyphicon-ok icon-success" style={{ color: 'black' }}></span>}</td>
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
