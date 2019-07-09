import React from "react";
import { connect } from 'react-redux';
import ProvideLink from './BackToTheProvidersPageButton.js';
import { Label, LineChart, LabelList, Line, XAxis, YAxis, CartesianAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

class FeedListPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  let feedData = this.props.feed;
  let feed = feedData.dataFeedElement;
  let feedDates = feed ? [...new Set(feed.map(item => item.dateCreated))]: [];
  let providerLink = feedData.provider != undefined ? feedData.provider: undefined;
  let filteredTemperatures = feed ? feed.filter(item => item.item.variableMeasured.name == 'humidity').map(temperatureItem => {
    return { dateRecorded: temperatureItem.dateCreated,  ["temperature (celsius)"]: temperatureItem.item.variableMeasured.value, hour: temperatureItem.dateCreated.slice(12,14)}
  }): [];
  return (feedDates.length > 0 ? <div>
    <label class="feed-dropdown">
  <div class="feed-dropdown-button">
    Select Feed
  </div>

  <input type="checkbox" class="feed-dropdown-input" id="test" />

  <ul class="feed-dropdown-menu">
    <li>Temperature</li>
    <li>Humidity</li>
    <li>Dew Point</li>
    <li>Wet Bulb Temperature</li>
    <li>Dry Bulb Temperature</li>
  </ul>
</label>
<div>
<a class="btn btn-primary" href="#" role="button">24 Hours</a>
<a class="btn btn-primary" href="#" role="button" disabled>One Week</a>
<a class="btn btn-primary" href="#" role="button" disabled>One Month</a>
<a class="btn btn-primary" href="#" role="button" disabled>One Year</a>
<a class="btn btn-primary" href="#" role="button" disabled>ALL</a>

  </div>
    {/* TODO:move styles to css file */}
    <div style={{height:'500px', width:'900px'}}>
    <ResponsiveContainer
        width="100%"
      >
        <LineChart
            data={filteredTemperatures}
            margin={{top: 5, right: 0, left: 0, bottom: 50}}>
          <XAxis 
            dataKey="hour"
            fontFamily="sans-serif"
            tickSize
            dy='26'
            label={'('+filteredTemperatures[0].dateRecorded.slice(0,10)+')'}
            tickMargin="30"
/>
          <YAxis
            domain={['dataMin', 'dataMax']}
            ticks={[10, 15, 20, 25, 30, 35, 40, 45, 50]}
          />
          <CartesianGrid 
            vertical={false}
            stroke="#ebf3f0"
          />
          <Tooltip />
          <Line dataKey="temperature (celsius)" dot={false}/>
        </LineChart>
      </ResponsiveContainer>
      </div>
    {
    providerLink !=undefined ? <ProvideLink providerLink={providerLink} /> :null
   }
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