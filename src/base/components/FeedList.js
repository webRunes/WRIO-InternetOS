import React from "react";
import { connect } from 'react-redux';
class FeedListPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  let feedData = this.props.feed;
  let feed = feedData.dataFeedElement;
  let feedDates = feed ? [...new Set(feed.map(item => item.dateCreated))]: [];
    return (feedDates.length > 0 ? <div>
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