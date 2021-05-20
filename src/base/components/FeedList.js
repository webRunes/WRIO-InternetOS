import React from "react";
import { connect } from 'react-redux';
import ProvideLink from './BackToTheProvidersPageButton.js';
import { Label, LineChart, LabelList, Line, XAxis, YAxis, CartesianAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import ToolTipLite from 'react-tooltip-lite';
import gconfig from '../../config';
import {NormailizeJSON} from "./utils/string"
const signalR = require("@aspnet/signalr");

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
class FeedListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'soil',
      devicestatus: "off",
      temperature: "0",
      battery: "0",
      soil: "0",
      showLastReadingItem: "Temperature",
      seconds: 0,
      ignoreState: false,
      lorafeeddata: [],
      isLoading: true,
      stillNeedToGetDataFromServer: true
    }
  }

  
  componentDidMount() {
    toast.configure();        
    //this.getSensorData();
    setTimeout(() => {
      let YAxisLable = document.getElementsByClassName('feedlist-chart-yaxis-label')[0];
      if (YAxisLable) {
        let tspan = YAxisLable.childNodes[0];
        tspan.setAttribute('x', 90);
      }
    }, 3000)

    let connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Debug)
  .withUrl(gconfig.gatewaysServiceUrl+'/devHub')
  .build();
      
    connection.on("ReceiveMessage", (topic ,jdata) => {
          console.log("ReceiveMessage:["+topic+"] "+ jdata + " ignore state: "+ this.state.ignoreState);           
          if(topic === "/iot/zolertia/replay"){
            jdata =  NormailizeJSON(jdata);
            var data = JSON.parse(jdata);
            if(data.Command == "on" && data.Result == "Success"){
              toast.success("The device has been successfully turned on");
            }
            else if(data.Command == "off" && data.Result == "Success"){
              toast.success("The device has been successfully turned off");
            }
            else if(data.Command == "SetTX" && data.Result == "Success"){
              toast.success("TX Level " + data.Value+" has been set");
            }
            else if (data.Command == "SetCh" && data.Result ==  "Success"){
              toast.success("Channel " + data.Value+" has been set");
            }
            else if(data.Commnad == "SetTX" && data.Result == "Failed"){
              toast.error("Something goes wrong. TX Level remains the same");
            }
            else if (data.Command == "SetCh" && data.Result ==  "Failed"){
              toast.error("Something goes wrong. Channel remains the same");
            }
          }
          else if(topic === "/iot/sensor/data" ){
            jdata =  NormailizeJSON(jdata);
            var data = JSON.parse(jdata);
            //this.setState({ temperature: (parseFloat(data.Temperature)/1000)});
            //this.setState({ battery: (parseFloat(data.BatteryVal)/1000)});
            this.setState({ temperature: (parseFloat(data.Temperature))});
            this.setState({ soil: (parseFloat(data.Soil))});
            if(this.state.ignoreState == false)
              this.setState({ devicestatus: "off"});
          }
          else if(topic === "/iot/sensor/boot" && jdata.includes("BOOTUP")){
            toast.success("The device is online");
          }
          else if(topic === "/iot/sensor/error"){
            if(jdata.includes("SERIALACCESSERROR")){
              toast.error("The device is turned off");
              if(this.state.ignoreState == false)
                this.setState({ devicestatus: "on"});
            }            
            if(jdata.includes("SERIALREADWRITEERROR")){
              toast.error("I/O error. Please restart the device");
              if(this.state.ignoreState == false)
                this.setState({ devicestatus: "on"});
            }
          }          
      });
      connection.on("send", data => {
          console.log(data);
      });
      
      connection.start().then(function () {
        console.log('Connected!');                
    }).catch(function (err) {
        return console.error("signalr error: "+err.toString());
    })

    try {
      this.interval = setInterval(async () => {
        const res = await fetch(gconfig.gatewaysServiceUrl+"/api/Device/IsDeviceConnected");
        const devstatus = await res.json();
        if(devstatus!= null && devstatus.status == false){
          this.setState({ devicestatus: "on"});        
          toast.error("Please re-start the experiment");
        }        
        console.log(devstatus);
      }, 50000);
    } catch(e) {
      console.log(e);
    }
  }
 
  startTimer = () => {
    this.setState({ seconds: 5, ignoreState : true});
    clearInterval(this.iInterval);
    this.iInterval = setInterval(() => {
      const { seconds } = this.state

      console.log("here sec: "+ this.state.seconds);
      if (seconds > 0) {
          this.setState(({ seconds }) => ({
              seconds: seconds - 1
          }))
      }
      if (seconds === 0) {            
              clearInterval(this.iInterval)
              this.setState({ ignoreState : false});
              console.log("timesup now!!!!");            
      } 
  }, 1000)
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
      case 'soil':
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
    this.startTimer();
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
      if(data.status){
        if(this.state.devicestatus === "on" )
          this.setState({ devicestatus: "off"});
        else
        this.setState({ devicestatus: "on"});
      }
      else{
        this.setState({ devicestatus: "on"});
        toast.error("The device is offline. Please re-start the experiment");
      }
    })
    .catch((error) => {
      console.log(error, "catch the hoop")
    })
  }
  getSensorData = (deviceid) => {   
    //console.log("Here object is "+JSON.stringify(object));
    fetch(gconfig.gatewaysServiceUrl+"/api/DeviceData/"+deviceid, {
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
      this.setState( {lorafeeddata : JSON.parse(dataval), isLoading: false});
      console.log("Hello "+this.state.lorafeeddata);
      this.render();
    })
    .catch((error) => {
      console.log(error, "catch the hoop")
    })
  }
  /*getSensorData = () => {   
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
        if(dataval.status == true){
          this.setState({ temperature: (parseFloat(dataval.data.temperature)/1000)});
          this.setState({ battery: (parseFloat(dataval.data.batteryVal)/1000)});
          
          if(dataval.data.isEnabled){
            this.setState({ devicestatus: "off"});
          }
          if(!dataval.data.isEnabled){
            this.setState({ devicestatus: "on"});
          }
       }
       else{
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
  }*/
  lastReadingSelected = (event) => {      

    this.setState({ showLastReadingItem: event.target.value });    
  }
  render() {
    let feedData = this.props.feed;
    //console.log("Feed data: "+JSON.stringify(feedData));
    if(this.props.feed.deviceId != undefined && this.state.stillNeedToGetDataFromServer == true){
      
      this.setState({ stillNeedToGetDataFromServer: 'false'});
      //this.setState( {isGettingServerCall: useState(true)});
      
      console.log("here device id is "+ this.props.feed.deviceId);
      this.getSensorData(this.props.feed.deviceId);
    }
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
    let sensorDataList = ["soil", "temperature"];//[...new Set(sensorData)];
    let selectedOptionCondition = this.state.selectedOption == 'soil' ? 'Percentage' : (this.state.selectedOption == 'temperature' ? 'Temperature' : (this.state.selectedOption == 'humidity' ? 'Humidity' : (this.state.selectedOption == 'pressure' ? 'Pressure' : 'State')));
    let filteredSelectedOptionObj = feed ? feed.filter(item => item.item.variableMeasured.name == this.state.selectedOption) : [];
    let filter = [];//feed ? filteredSelectedOptionObj[0].item.variableMeasured.value: [] ;
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

    //////////////////////////////////////////
    
    let temperatureList = [...new Set(filteredSelectedOption.map(item => item != undefined
     ? +item[selectedOptionCondition] : undefined))].sort();
    let newTemperatureList = [];
    temperatureList.map((item, index) => {
      if (item) {
        newTemperatureList.push(item);
      }
    })

    console.log("Here Filter "+ JSON.stringify(temperatureList) + " and "+ JSON.stringify(filteredSelectedOption));
    let xaxishours = [];
    filteredSelectedOption = this.state.lorafeeddata.filter(i=> { let date = new Date(i.Updatedate);

      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      return minutes == 0
      }).map(item => {
        let date = new Date(item.Updatedate);
        xaxishours.push(date.getHours());
        return {dateRecorded: item.Updatedate, Temperature: item.TempData,Percentage: item.SoilData, hour: date.getHours()};
      
    });
    console.log("Here Result Filter "+ JSON.stringify(temperatureList) + " and "+ JSON.stringify(filteredSelectedOption ));
    return (
      
      
        this.state.isLoading ? (
        <div>
          <ReactLoading type={"bars"} color={"grey"} />
        </div> 
        ) : (

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
                <option value="Soil">Soil</option>                
          </select> 
          </div>
          {this.state.showLastReadingItem === "Temperature" ? <label class="pull-left">{this.state.temperature} °C <button class="btn-link btn-refresh"><i class="material-icons" onClick={this.getSensorData}>refresh</i></button></label> : <label class="pull-left">{this.state.soil} <button class="btn-link btn-refresh"><i class="material-icons" onClick={this.getSensorData}>refresh</i></button></label> } 
          
          
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
                dy='0'
                label='Hours'
                tickMargin="30"
                tickSize={8}
                domain={['dataMin', 'dataMax']}
                ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]/*xaxishours*/}
              />
              <YAxis
                domain={['dataMin', 'dataMax']}
                ticks={[0,10,20,30,40,50,60,70,80,90,100]}//{this.state.selectedOption != 'state' ? temperatureList : ['Enabled', 'Disabled']}
                label={{ value: this.state.selectedOption == 'soil' ? 'Percentage, %' : (this.state.selectedOption == 'temperature' ? 'Temperature, °C' : (this.state.selectedOption == 'humidity' ? 'Humidity, RH' : (this.state.selectedOption == 'pressure' ? 'Pressure, hPa' : 'Sensor state'))), angle: -90, position: 'insideBottomLeft', className: 'feedlist-chart-yaxis-label' }}
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

this.state.lorafeeddata.map(
                (date, index) => {
                  let Feedindex = index;
                  return (
                    <div className="paragraph">
                      <div className="col-xs-12">
                        <span class="timeline-step"><i class="material-icons">schedule</i></span>
                        <div className="timeline-content">

                          <h2>{date.Updatedate}</h2>

                          <p>{'Soil Data: '}
                            {date.SoilData} &#37;</p>

                            <p>{'Temp Data: '}
                            {date.TempData} &#8451;</p>

                          


                        </div>
                      </div>
                    </div>
                  );
                }
              )
            }
          </div>
        </div>
      </div> : null));
  }
}

const mapStateToProps = state => ({
  feed: state.document.feed,
});

export const FeedList = connect(mapStateToProps)(FeedListPage);
