import React from "react";

const FeedList = ({ feed }) => {
  return [...new Set(feed.map(item => item.dateCreated.slice(0, 10)))].map(
    date => {
      return (
        <div>
          <h2>{date}</h2>
          {feed
            .filter(data => data.dateCreated.slice(0, 10) === date)
            .map(filterdData => {
              return (
                <p>
                  {filterdData.dateCreated.slice(12)} &nbsp;{" "}
                  {filterdData.item.variableMeasured.value}&deg;{"C"}
                </p>
              );
            })}
        </div>
      );
    }
  );
};

export default FeedList;