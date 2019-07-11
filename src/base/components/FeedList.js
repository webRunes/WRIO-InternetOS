import React from "react";
import { connect } from 'react-redux';
import ProvideLink from './BackToTheProvidersPageButton.js';
import { Label, LineChart, LabelList, Line, XAxis, YAxis, CartesianAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

class FeedListPage extends React.Component {
  constructor(props) {
    super(props);
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

  render() {
  let feedData = this.props.feed;
  let feed = feedData.dataFeedElement;
  let feedDates = feed ? [...new Set(feed.map(item => item.dateCreated))]: [];
  let providerLink = feedData.provider != undefined ? feedData.provider: undefined;
  let sensorData = feed ? feed.map(item => item.item.variableMeasured.name) : undefined;
  let sensorDataList = [...new Set(sensorData)];
  let filteredTemperatures = feed ? feed.filter(item => item.item.variableMeasured.name == 'humidity' || item.item.variableMeasured.name == 'temperature').map(temperatureItem => {
    return { dateRecorded: temperatureItem.dateCreated,  ["Temperature"]: temperatureItem.item.variableMeasured.value, hour: temperatureItem.dateCreated.slice(12,14)}
  }): [];

 let temperatureList =  [...new Set(filteredTemperatures.map(item => +item["Temperature"]))].sort();

 temperatureList = temperatureList.length >0 ? FeedListPage.range(temperatureList[0], temperatureList[temperatureList.length - 1] ? temperatureList[temperatureList.length - 1]: 50,5): [];
  return (feedDates.length > 0 ? <div>

    {providerLink !=undefined ? <ProvideLink providerLink={providerLink} /> :null}

    <label className="feed-dropdown pull-right">
    <div className="feed-dropdown-button">Select Feed</div>
    <input type="checkbox" className="feed-dropdown-input" id="test" />
    <ul className="feed-dropdown-menu">
      {
        sensorDataList.map(data => {
          return (<li>{data.charAt(0).toUpperCase() + data.slice(1)}</li>)
        })
      }
    </ul>
    </label>
      <ol class="breadcrumb chart_timeframe">
        <li><a href="#">Last 24 Hours</a></li>
        <li class="disabled"><a href="#" data-toggle="tooltip" data-placement="top" title="Available for Premium users only">1 Week</a></li>
        <li class="disabled"><a href="#" data-toggle="tooltip" data-placement="top" title="Available for Premium users only">1 Month</a></li>
        <li class="disabled"><a href="#" data-toggle="tooltip" data-placement="top" title="Available for Premium users only">1 Year</a></li>
        <li class="disabled"><a href="#" data-toggle="tooltip" data-placement="top" title="Available for Premium users only">Full History</a></li>
      </ol>
    <div className="feed-chart-main-div">
      <ResponsiveContainer
          width="100%"
        >
          <LineChart
              data={filteredTemperatures}
              margin={{top: 5, right: 0, left: 12, bottom: 50}}>
            <XAxis
              dataKey="Hour"
              fontFamily="sans-serif"
              tickSize
              dy='26'
              label='Hours'
              tickMargin="30"/>
            <YAxis
              domain={['dataMin', 'dataMax']}
              ticks={temperatureList}
              label={{ value: 'Temperature, °C', angle: -90, position: 'insideLeft' }}
            />
            <CartesianGrid
              vertical={false}
              horizontal={false}
              stroke="#ebf3f0"
            />
            <Tooltip />
            <Line dataKey="Temperature" dot={true}/>
          </LineChart>
        </ResponsiveContainer>
        <h2>Details</h2>
      </div>
    {
    feedDates.map(
    date => {
      let filterFeed = feed.filter(item => {
        return item.dateCreated == date;
      })
      return (
        <div>
          <h1>{filterFeed[0].dateCreated.slice(12,20)}</h1>
          <p>State: {filterFeed[0].item.variableMeasured.value}</p>
          <p>Temperature: {filterFeed[1].item.variableMeasured.value} &deg;{"C"}</p>
          <p>Battery: {filterFeed[2].item.variableMeasured.value}</p>
        </div>
      );
    }
  )
    }
  </div>:null);
  }
}

const mapStateToProps = state => ({
  feed: state.document.feed,
});

export const FeedList = connect(mapStateToProps)(FeedListPage);
