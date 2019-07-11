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
      case 'humidity' :
        this.setState({selectedOption: value})
        break;
      case 'battery': 
      this.setState({selectedOption: value})
      break;
      default:
        console.log('State is not selectable');
    }
    }

  render() {
  let feedData = this.props.feed;
  let feed = feedData.dataFeedElement;
  let feedDates = feed ? [...new Set(feed.map(item => item.dateCreated))]: [];
  let providerLink = feedData.provider != undefined ? feedData.provider: undefined;
  let sensorData = feed ? feed.map(item => item.item.variableMeasured.name) : undefined;
  let sensorDataList = [...new Set(sensorData)];
  let selectedOptionCondition = this.state.selectedOption == 'battery' ? 'Percentage': 'Temperature';
  let filteredTemperatures = feed ? feed.filter(item => item.item.variableMeasured.name == this.state.selectedOption).map(temperatureItem => {
    return { dateRecorded: temperatureItem.dateCreated,  [selectedOptionCondition]: temperatureItem.item.variableMeasured.value, hour: temperatureItem.dateCreated.slice(12,14)}
  }): [];

 let temperatureList =  [...new Set(filteredTemperatures.map(item => +item[selectedOptionCondition]))].sort();

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
          return (<li onClick={e => this.onDropDownSelect(data)}>{data.charAt(0).toUpperCase() + data.slice(1)}</li>)
        })
      }
    </ul>
    </label>
      <ol class="breadcrumb chart_timeframe">
        <li><a href="#">Last 24 Hours</a></li>
        <li class="disabled"><a href="#">1 Week</a></li>
        <li class="disabled"><a href="#">1 Month</a></li>
        <li class="disabled"><a href="#">1 Year</a></li>
        <li class="disabled"><a href="#">Full History</a></li>
      </ol>
    <div className="feed-chart-main-div">
      <ResponsiveContainer
          width="100%"
        >
          <LineChart
              data={filteredTemperatures}
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
              ticks={temperatureList}
              label={{ value: this.state.selectedOption == 'battery'? 'Percentage, %' : 'Temperature, °C', angle: -90, position:'insideBottomLeft' }}
              tickSize={8} 
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

        <div class="main_page_content">
          <div>
            <section>
              <div class="col-xs-12">
                <h1>Details</h1>
              </div>
            </section>
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
