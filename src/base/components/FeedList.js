import React from "react";

const FeedList = ({ feed }) => {
  let feedDates = [...new Set(feed.map(item => item.dateCreated))];
  return feedDates.map(
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
  );
};

export default FeedList;