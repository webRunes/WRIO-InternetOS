import React from "react";
import { connect } from 'react-redux';
import ProvideLink from './BackToTheProvidersPageButton.js';
import { Label, LineChart, LabelList, Line, XAxis, YAxis, CartesianAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

class FeedListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'battery'
    }
  }

  static range = function(start, end, step) {
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
    switch(value) {
      case 'temperature':
        this.setState({selectedOption: value})
        break;
      case 'humidity':
        this.setState({selectedOption: value})
        break;
      case 'battery':
      this.setState({selectedOption: value})
      break;
      case 'state':
      this.setState({selectedOption: value})
      break;
      default:
    }
    }

  render() {
  let feedData = this.props.feed;
  let feed = feedData.dataFeedElement;
  let feedDates = feed ? [...new Set(feed.map(item => item.dateCreated))]: [];
  let providerLink = feedData.provider != undefined ? feedData.provider: undefined;
  let sensorData = feed ? feed.map(item => item.item.variableMeasured.name) : undefined;
  let sensorDataList = [...new Set(sensorData)];
  let selectedOptionCondition = this.state.selectedOption == 'battery' ? 'Percentage': this.state.selectedOption == ('humidity' || 'temperature') ? 'Temperature': 'Status';
  let filteredSelectedOptionObj = feed ? feed.filter(item => item.item.variableMeasured.name == this.state.selectedOption) : [];
  let filteredSelectedOption = this.state.selectedOption != 'state' ?  filteredSelectedOptionObj.map(temperatureItem => {
    return { dateRecorded: temperatureItem.dateCreated,  [selectedOptionCondition]: temperatureItem.item.variableMeasured.value, hour: temperatureItem.dateCreated.slice(12,14)}
  }): filteredSelectedOptionObj.map(item => {
    return { dateRecorded: item.dateCreated,  [selectedOptionCondition]: item.item.variableMeasured.value, hour: item.dateCreated.slice(12,14) }
  }) ;

 let temperatureList =  [...new Set(filteredSelectedOption.map(item => +item[selectedOptionCondition]))].sort();

 temperatureList = temperatureList.length >0 ? FeedListPage.range(temperatureList[0], temperatureList[temperatureList.length - 1] ? temperatureList[temperatureList.length - 1]: 50,4): [];
  return (
    feedDates.length > 0 ? <div>

    {providerLink !=undefined ? <ProvideLink providerLink={providerLink} /> :null}

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
        <li class="disabled"><a href="#" data-toggle="tooltip" data-placement="top" title="Premium feature, available to Alpha testers only">1 Week</a></li>
        <li class="disabled"><a href="#" data-toggle="tooltip" data-placement="top" title="Premium feature, available to Alpha testers only">1 Month</a></li>
        <li class="disabled"><a href="#" data-toggle="tooltip" data-placement="top" title="Premium feature, available to Alpha testers only">1 Year</a></li>
        <li class="disabled"><a href="#" data-toggle="tooltip" data-placement="top" title="Premium feature, available to Alpha testers only">Full History</a></li>
      </ol>
    <div className="feed-chart-main-div">
      <ResponsiveContainer
          width="100%"
        >
          <LineChart
              data={filteredSelectedOption}
              margin={{top: 5, right: 0, left: 12, bottom: 30}}>
            <XAxis
              // dataKey="hour"
              fontFamily="sans-serif"
              dy='26'
              label='Hours'
              tickMargin="30"
              tickSize={8}
              domain={['dataMin', 'dataMax']}
              ticks={[0,2,4,6,8,10,12,14,16,18,20,22,24]}
              />
            <YAxis
              domain={['dataMin', 'dataMax']}
              ticks={this.state.selectedOption != 'state'? temperatureList: ['Enabled', 'Disabled']}
              label={{ value: this.state.selectedOption == 'battery'? 'Percentage, %' : (this.state.selectedOption != 'state' ?'Temperature, °C': 'Sensor status'), angle: -90, position:'insideBottomLeft' }}
              tickSize={8}
              type={this.state.selectedOption != 'state'?  "number": "category"}
             />
            <CartesianGrid
              vertical={true}
              horizontal={true}
              stroke="#ebf3f0"
              strokeDasharray="2"
              strokeWidth={1}
            />
            <Tooltip />
            <Line dataKey={selectedOptionCondition} dot={true}/>
          </LineChart>
        </ResponsiveContainer>

        <div className="feedPage">
          <div className="col-xs-12">
            <div className="data_export btn-group btn-group-xs pull-right" role="group" aria-label="Data Export">
              <button type="button" disabled className="btn btn-default" data-toggle="tooltip" data-placement="top" title="Premium feature, available to Alpha testers only">Copy</button>
              <button type="button" disabled className="btn btn-default" data-toggle="tooltip" data-placement="top" title="Premium feature, available to Alpha testers only">CSV</button>
              <button type="button" disabled className="btn btn-default" data-toggle="tooltip" data-placement="top" title="Premium feature, available to Alpha testers only">Excel</button>
              <button type="button" disabled className="btn btn-default" data-toggle="tooltip" data-placement="top" title="Premium feature, available to Alpha testers only">PDF</button>
              <button type="button" disabled className="btn btn-default" data-toggle="tooltip" data-placement="top" title="Premium feature, available to Alpha testers only">Print</button>
            </div>
            <h1>Details</h1>
          </div>
        </div>
    {
    feedDates.map(
    date => {
      let filterFeed = feed.filter(item => {
        return item.dateCreated == date;
      })
      return (
        <div className="paragraph">
          <div className="col-xs-12">
            <div>
              <h2>{filterFeed[0].dateCreated.slice(12,20)}</h2>
              <p>State: {filterFeed[0].item.variableMeasured.value}</p>
              <p>Temperature: {filterFeed[1].item.variableMeasured.value} &deg;{"C"}</p>
              <p>Battery: {filterFeed[2].item.variableMeasured.value}</p>
            </div>
          </div>
        </div>
      );
    }
  )
    }
  </div>
  </div>:null);
  }
}

const mapStateToProps = state => ({
  feed: state.document.feed,
});

export const FeedList = connect(mapStateToProps)(FeedListPage);
