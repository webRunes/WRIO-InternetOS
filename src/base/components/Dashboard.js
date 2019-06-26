import React from 'react';


export default class Dashboard extends React.Component {


  componentDidMount() {
    document.getElementsByClassName('main')[0].style.width = "1200px";
    document.getElementsByClassName('main')[0].style.maxWidth = "1200px";
  }

    render() {
        return (<div>
          <div>
          <span class="tool-tip" data-toggle="tooltip" data-placement="top" title="Coming">
    <button disabled="disabled" class="btn btn-default">Add New Device</button>
</span>
            </div>
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
          <input type="checkbox" class="custom-control-input" id="tableDefaultCheck1" disabled="true"/>
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
      <th>Device battery measurement</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="tableDefaultCheck2" />
        </div>
      </th>
      <td>2313...</td>
      <td><a>Sensor_ID1</a></td>
      <td>?</td>
      <td>Public</td>
      <td>Free</td>
      <td>?</td>
      <td>Publisher</td>
      <td>0</td>
      <td><span class="glyphicon glyphicon-ok icon-success" style={{color:'green'}}></span></td>
      <td>2 mins ago</td>
      <td>    <div class="dropdown">
        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">-35 to -30 °C
          <span class="caret"></span></button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">HTML</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">CSS</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">JavaScript</a></li>
          <li role="presentation" class="divider"></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">About Us</a></li>
        </ul>
      </div></td>
      <td>Cell 1</td>
    </tr>
    <tr>
      <th scope="row">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="tableDefaultCheck3"/>
        </div>
      </th>
      <td>5313...</td>
      <td><a>Sensor_ID2</a></td>
      <td>?</td>
      <td>Public</td>
      <td>Free</td>
      <td>?</td>
      <td>Publisher</td>
      <td>0</td>
      <td><span class="glyphicon glyphicon-ok icon-success" style={{color:'green'}}></span></td>
      <td>12 mins ago</td>
      <td>    <div class="dropdown">
        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">-25 to -30 °C
          <span class="caret"></span></button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">HTML</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">CSS</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">JavaScript</a></li>
          <li role="presentation" class="divider"></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">About Us</a></li>
        </ul>
      </div></td>
      <td>Cell 2</td>
    </tr>
    <tr>
      <th scope="row">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="tableDefaultCheck4"/>
        </div>
      </th>
      <td>6313...</td>
      <td><a>sensor_ID3</a></td>
      <td>?</td>
      <td>Public</td>
      <td>Free</td>
      <td>?</td>
      <td>Publisher</td>
      <td>0</td>
      <td><span class="glyphicon glyphicon-ok icon-success" style={{color:'green'}}></span></td>
      <td>40 mins ago</td>
      <td>    <div class="dropdown">
        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">-15 to -25 °C
          <span class="caret"></span></button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">HTML</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">CSS</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">JavaScript</a></li>
          <li role="presentation" class="divider"></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">About Us</a></li>
        </ul>
      </div></td>
      <td>Cell 3</td>
    </tr>
    <tr>
      <th scope="row">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="tableDefaultCheck4"/>
        </div>
      </th>
      <td>6313...</td>
      <td><a>sensor_ID3</a></td>
      <td>?</td>
      <td>Public</td>
      <td>Free</td>
      <td>?</td>
      <td>Publisher</td>
      <td>0</td>
      <td><span class="glyphicon glyphicon-ok icon-success"></span></td>
      <td>30 mins ago</td>
      <td>    <div class="dropdown">
        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">-05 to -10 °C
          <span class="caret"></span></button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">HTML</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">CSS</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">JavaScript</a></li>
          <li role="presentation" class="divider"></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">About Us</a></li>
        </ul>
      </div></td>
      <td>Cell 4</td>
    </tr>
    <tr>
      <th scope="row">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="tableDefaultCheck4"/>
        </div>
      </th>
      <td>6313...</td>
      <td><a>sensor_ID3</a></td>
      <td>?</td>
      <td>Public</td>
      <td>Free</td>
      <td>?</td>
      <td>Publisher</td>
      <td>0</td>
      <td><span class="glyphicon glyphicon-ok icon-success"></span></td>
      <td>18 mins ago</td>
      <td>    <div class="dropdown">
        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">-05 to 0.0 °C
          <span class="caret"></span></button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">HTML</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">CSS</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">JavaScript</a></li>
          <li role="presentation" class="divider"></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">About Us</a></li>
        </ul>
      </div></td>
      <td>Cell 5</td>
    </tr>
  </tbody>
</table>
</div>
        );
    }
}