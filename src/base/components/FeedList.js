import React from "react";
import { connect } from 'react-redux';
import ProvideLink from './BackToTheProvidersPageButton.js';
import { Label, LineChart, LabelList, Line, XAxis, YAxis, CartesianAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import ToolTipLite from 'react-tooltip-lite';
import gconfig from '../../config';
class FeedListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'battery',
      devicestatus: "off",
      temperature: "0",
      battery: "0",
      showLastReadingItem: "Temperature"
    }
  }

  componentDidMount() {
    this.getSensorData();
    setTimeout(() => {
      let YAxisLable = document.getElementsByClassName('feedlist-chart-yaxis-label')[0];
      if (YAxisLable) {
        let tspan = YAxisLable.childNodes[0];
        tspan.setAttribute('x', 90);
      }
    }, 3000)
  }

  static range = function (start, end, step) {
    var range = [];
    var typeofStart = typeof start;
    var typeofEnd = typeof end;

    if (step === 0) {
      throw TypeError("Step cannot be zero.");
    }

    if (typeofStart == "undefined" || typeofEnd == "undefined") {
      throw TypeError("Must pass start and end arguments.");
    } else if (typeofStart != typeofEnd) {
      throw TypeError("Start and end arguments must be of same type.");
    }

    typeof step == "undefined" && (step = 1);

    if (end < start) {
      step = -step;
    }

    if (typeofStart == "number") {

      while (step > 0 ? end >= start : end <= start) {
        range.push(start);
        start += step;
      }

    } else if (typeofStart == "string") {

      if (start.length != 1 || end.length != 1) {
        throw TypeError("Only strings with one character are supported.");
      }

      start = start.charCodeAt(0);
      end = end.charCodeAt(0);

      while (step > 0 ? end >= start : end <= start) {
        range.push(String.fromCharCode(start));
        start += step;
      }

    } else {
      throw TypeError("Only string and number types are supported");
    }

    return range;

  }

  onDropDownSelect(value) {
    switch (value) {
      case 'temperature':
        this.setState({ selectedOption: value })
        break;
      case 'humidity':
        this.setState({ selectedOption: value })
        break;
      case 'battery':
        this.setState({ selectedOption: value })
        break;
      case 'state':
        this.setState({ selectedOption: value })
        break;
      case 'pressure':
        this.setState({ selectedOption: value })
        break;
      default:
    }
  }

  setConfig = () => {
    var setval={dev:"Mote",opr:this.state.devicestatus};    
    fetch(gconfig.gatewaysServiceUrl+"/api/Device", {
      method: "POST",
      dataType: "JSON",
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(setval)
    })
    .then((resp) => {
      return resp.json()
    })
    .then((data) => {
      if(this.state.devicestatus === "on")
        this.setState({ devicestatus: "off"});
      else
      this.setState({ devicestatus: "on"});
    })
    .catch((error) => {
      console.log(error, "catch the hoop")
    })
  }
  getSensorData = () => {   
    //console.log("Here object is "+JSON.stringify(object));
    fetch(gconfig.gatewaysServiceUrl+"/api/Device/GetSensorValue", {
      method: "GET",
      dataType: "JSON",
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      //body: JSON.stringify(setval)
    })
    .then((resp) => {
      return resp.json()
    })
    .then((dataval) => {           
      if(dataval != null){
      this.setState({ temperature: (parseFloat(dataval.temperature)/1000)});
      this.setState({ battery: (parseFloat(dataval.batteryVal)/1000)});
      
      if(dataval.isEnabled){
        this.setState({ devicestatus: "off"});
      }
      if(!dataval.isEnabled){
        this.setState({ devicestatus: "on"});
      }
      }
      else{
        this.setState({ devicestatus: "on"});
      }
    })
    .catch((error) => {
      console.log(error, "catch the hoop")
    })
  }
  lastReadingSelected = (event) => {      

    this.setState({ showLastReadingItem: event.target.value });    
  }
  render() {
    let feedData = this.props.feed;
    let feed = feedData.dataFeedElement;
    let FeedState,FeedTemprature,FeedBattery;
    for (var key in feed) {
      if(feed[key].item.variableMeasured.name == "state"){
            FeedState = feed[key]}
      if(feed[key].item.variableMeasured.name == "temperature"){
            FeedTemprature = feed[key]
          }
      if(feed[key].item.variableMeasured.name == "battery"){
            FeedBattery = feed[key]}
      }
    FeedState = feed ? FeedState : [];
    FeedTemprature = feed ? FeedTemprature : [];
    let feedDates_new = this.props.feed.dateModified;
    let feedDates = new Set();
    feedDates = feed ? feedDates_new :[];

    let providerLink = feedData.provider != undefined ? feedData.provider : undefined;
    let sensorData = feed ? feed.map(item => item.item.variableMeasured.name) : undefined;
    let sensorDataList = [...new Set(sensorData)];
    let selectedOptionCondition = this.state.selectedOption == 'battery' ? 'Percentage' : (this.state.selectedOption == 'temperature' ? 'Temperature' : (this.state.selectedOption == 'humidity' ? 'Humidity' : (this.state.selectedOption == 'pressure' ? 'Pressure' : 'State')));
    let filteredSelectedOptionObj = feed ? feed.filter(item => item.item.variableMeasured.name == this.state.selectedOption) : [];
    let filter = feed ? filteredSelectedOptionObj[0].item.variableMeasured.value: [] ;
    let filteredSelectedOption = feed != 'state' ?
    filter.map((temperatureItem,index) => {
      return { dateRecorded: feedDates ? feedDates[index] : undefined,
        [selectedOptionCondition]: temperatureItem,
         hour: feedDates ? feedDates[index].slice(12,14) : undefined}
    }):filter.map((item,index) => {
      return { dateRecorded: feedDates ? feedDates[index] : undefined,
       [selectedOptionCondition]: item,
        hour: feedDates ? feedDates[index].slice(12,14) : undefined }
    });
    filteredSelectedOption = filteredSelectedOption.map(item => {
      return !Object.values(item).includes("") ? item : undefined
    })
    let temperatureList = [...new Set(filteredSelectedOption.map(item => item != undefined
     ? +item[selectedOptionCondition] : undefined))].sort();
    let newTemperatureList = [];
    temperatureList.map((item, index) => {
      if (item) {
        newTemperatureList.push(item);
      }
    })
    return (
      feedDates.length > 0 ? <div>

        {providerLink != undefined ? <ProvideLink providerLink={providerLink} /> : null}
        <div className="row">
          <div className="control-left control-panel col-sm-6">
            <h1><i className="material-icons">notifications_active</i>Alerts</h1>
            <p>0</p>
            <ToolTipLite className="tooltip-b" content="Available to Alpha testers only"><button className="btn btn-sm disabled">Set threshold</button></ToolTipLite>
          </div>
          <div className="control-right control-panel col-sm-6">
          <h1><i className="material-icons">settings_input_antenna</i>Last readings</h1>
          
    {this.state.devicestatus=== "on" ? <React.Fragment> <p>The device is offline</p> </React.Fragment> : <React.Fragment> 
    <br />
      <div class="col-sm-6">
      <select class="form-control" onChange={this.lastReadingSelected} >
                <option value="Temperature">Temperature</option>
                <option value="Battery">Battery</option>                
          </select> 
          </div>
          {this.state.showLastReadingItem === "Temperature" ? <label class="pull-left">{this.state.temperature} °C <button class="btn-link btn-refresh"><i class="material-icons" onClick={this.getSensorData}>refresh</i></button></label> : <label class="pull-left">{this.state.battery}V <button class="btn-link btn-refresh"><i class="material-icons" onClick={this.getSensorData}>refresh</i></button></label> } 
          
          
          <br />
          <br />                   
          </React.Fragment>}          
            <button class={this.state.devicestatus=== "off" ?  "btn btn-danger btn-sm" : "btn btn-success btn-sm"} type="button" id="Mote" ref="Mote" value={this.state.devicestatus}  onClick={this.setConfig} data-loading-text="Loading ...">Turn {this.state.devicestatus} Zolertia</button>
          </div>
        </div>

        <label className="feed-dropdown pull-right">
          <div className="feed-dropdown-button">{this.state.selectedOption.charAt(0).toUpperCase() + this.state.selectedOption.slice(1)}</div>
          <input type="checkbox" className="feed-dropdown-input" id="test" />
          <ul className="feed-dropdown-menu">
            {
              sensorDataList.map(data => {
                // if(data != 'state') {
                return (<li onClick={e => this.onDropDownSelect(data)}>{data.charAt(0).toUpperCase() + data.slice(1)}</li>)
                // }
              })
            }
          </ul>
        </label>
        <ol class="breadcrumb chart_timeframe">
          <li><a href="#">Last 24 Hours</a></li>
          <li class="disabled"><ToolTipLite className="tooltip-a" content="Premium feature, available to Alpha testers only"><a href="#">Week</a></ToolTipLite></li>
          <li class="disabled"><ToolTipLite className="tooltip-a" content="Premium feature, available to Alpha testers only"><a href="#">Month</a></ToolTipLite></li>
          <li class="disabled"><ToolTipLite className="tooltip-a" content="Premium feature, available to Alpha testers only"><a href="#">Year</a></ToolTipLite></li>
          <li class="disabled"><ToolTipLite className="tooltip-a" content="Premium feature, available to Alpha testers only"><a href="#">All</a></ToolTipLite></li>
          <li class="disabled"><ToolTipLite className="tooltip-a" content="Premium feature, available to Alpha testers only"><a href="#">Custom</a></ToolTipLite></li>
        </ol>
        <div className="feed-chart-main-div">
          <ResponsiveContainer
            width="100%"
          >
            <LineChart
              data={filteredSelectedOption}
              margin={{ top: 5, right: 0, left: 12, bottom: 30 }}>
              <XAxis
                // dataKey="hour"
                fontFamily="sans-serif"
                dy='26'
                label='Hours'
                tickMargin="30"
                tickSize={8}
                domain={['dataMin', 'dataMax']}
                ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]}
              />
              <YAxis
                domain={['dataMin', 'dataMax']}
                ticks={this.state.selectedOption != 'state' ? temperatureList : ['Enabled', 'Disabled']}
                label={{ value: this.state.selectedOption == 'battery' ? 'Volts, V' : (this.state.selectedOption == 'temperature' ? 'Temperature, °C' : (this.state.selectedOption == 'humidity' ? 'Humidity, RH' : (this.state.selectedOption == 'pressure' ? 'Pressure, hPa' : 'Sensor state'))), angle: -90, position: 'insideBottomLeft', className: 'feedlist-chart-yaxis-label' }}
                tickSize={8}
                type={this.state.selectedOption != 'state' ? "number" : "category"}
              />
              <CartesianGrid
                vertical={true}
                horizontal={true}
                stroke="#ebf3f0"
                strokeDasharray="2"
                strokeWidth={1}
              />
              <Tooltip />
              <Line dataKey={selectedOptionCondition} dot={true} />
            </LineChart>
          </ResponsiveContainer>

          <div className="feedPage">
            <div className="col-xs-12">
              <div className="data_export btn-group btn-group-xs pull-right" role="group" aria-label="Data Export">
                <ToolTipLite className="tooltip-b" content="Available to Alpha testers only"><button disabled="disabled" type="button" className="btn btn-default">Copy</button></ToolTipLite>
                <ToolTipLite className="tooltip-b" content="Available to Alpha testers only"><button disabled="disabled" type="button" className="btn btn-default">CSV</button></ToolTipLite>
                <ToolTipLite className="tooltip-b" content="Available to Alpha testers only"><button disabled="disabled" type="button" className="btn btn-default">Excel</button></ToolTipLite>
                <ToolTipLite className="tooltip-b" content="Available to Alpha testers only"><button disabled="disabled" type="button" className="btn btn-default">PDF</button></ToolTipLite>
                <ToolTipLite className="tooltip-b" content="Available to Alpha testers only"><button disabled="disabled" type="button" className="btn btn-default">Print</button></ToolTipLite>
              </div>
              <h1>Timeline</h1>
            </div>
          </div>
          <div className="timeline col-xs-12">
            {

              feedDates.map(
                (date, index) => {
                  let Feedindex = index;
                  return (
                    <div className="paragraph">
                      <div className="col-xs-12">
                        <span class="timeline-step"><i class="material-icons">schedule</i></span>
                        <div className="timeline-content">

                          <h2>{feedDates[index].slice(12, 20)}</h2>

                          <p>{FeedBattery.item.variableMeasured.name.charAt(0).toUpperCase() +
                              FeedBattery.item.variableMeasured.name.slice(1) + ': '}
                            {FeedBattery.item.variableMeasured.value[index]} V</p>

                          <p>{FeedTemprature.item.variableMeasured.name.charAt(0).toUpperCase() +
                              FeedTemprature.item.variableMeasured.name.slice(1) + ': '}
                            {FeedTemprature.item.variableMeasured.value[index]} &#8451;</p>

                          <p>{FeedState.item.variableMeasured.name.charAt(0).toUpperCase() +
                              FeedState.item.variableMeasured.name.slice(1) + ': '}
                            {FeedState.item.variableMeasured.value[index]}</p>


                        </div>
                      </div>
                    </div>
                  );
                }
              )
            }
          </div>
        </div>
      </div> : null);
  }
}

const mapStateToProps = state => ({
  feed: state.document.feed,
});

export const FeedList = connect(mapStateToProps)(FeedListPage);
