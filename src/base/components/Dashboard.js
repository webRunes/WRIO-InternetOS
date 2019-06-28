import React from 'react';
import { connect } from "react-redux";

class DashboardPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let sensorData = this.props.sensorData;
    let fetchedData = sensorData.length ? sensorData.map(item => item.payload).map(item => item.dataFeedElement) : [];

    return (<div>
      <span class="tool-tip" data-toggle="tooltip" data-placement="top" title="Coming">
        <button disabled="disabled" class="btn btn-default">Add New Device</button>
      </span>
      <div>
        <span class="tool-tip" data-toggle="tooltip" data-placement="top" title="Upgrade to premium. Coming">
          <button disabled="disabled" class="btn btn-default">Group Management</button>
        </span>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="tableDefaultCheck1" disabled="true" />
              </div>
            </th>
            <th>ID </th>
            <th>Name </th>
            <th>Location </th>
            <th>Access </th>
            <th>Cost </th>
            <th>Protocol </th>
            <th>Role </th>
            <th>Alerts </th>
            <th>State </th>
            <th>Last seen</th>
            <th>Last measurement</th>
            <th>Device battery</th>
          </tr>
        </thead>
        <tbody>
          {
            fetchedData != undefined ?
              fetchedData.map(sensors => {

                return (
                sensors.length && <tr>
                  <th scope="row">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id="tableDefaultCheck4" />
                    </div>
                  </th>
                  <td>{sensors[0].item.variableMeasured.value}</td>
                  <td><a>{sensors[1].item.variableMeasured.value}</a></td>
                  <td>{sensors[2].item.variableMeasured.value}</td>
                  <td>{sensors[3].item.variableMeasured.value}</td>
                  <td>{sensors[4].item.variableMeasured.value}</td>
                  <td>{sensors[5].item.variableMeasured.value}</td>
                  <td>{sensors[6].item.variableMeasured.value}</td>
                  <td>{sensors[7].item.variableMeasured.value}</td>
                  <td>{sensors[8].item.variableMeasured.value == true ? <span class="glyphicon glyphicon-ok icon-success" style={{ color: 'green' }}></span> : <span class="glyphicon glyphicon-ok icon-success" style={{ color: 'black' }}></span>}</td>
                  <td>{sensors[9].item.variableMeasured.value}</td>
                  <td>
                    <div class="dropdown">
                      <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">{sensors[10].item.variableMeasured.value.slice(-1)[0]} &#8451;
                         <span class="caret"></span></button>
                      <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                        {sensors[10].item.variableMeasured.value.map(record => {
                          return (
                            <li role="presentation"><a role="menuitem" tabindex="-1" href="#">{record}</a></li>
                          )
                        })}
                      </ul>
                    </div>

                  </td>
                  <td>{sensors[11].item.variableMeasured.value}</td>

                </tr>)

              }) : null
          }
        </tbody>
      </table>


    </div>)
  }
}

const mapStateToProps = state => ({
  sensorData: state.document.sensorData
});

export const Dashboard = connect(mapStateToProps)(DashboardPage);
