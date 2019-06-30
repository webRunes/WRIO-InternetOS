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
              {filterdData.item.variableMeasured.name == 'last-measurement'? filterdData.item.variableMeasured.value.map(item => <span>{item}&deg;{"C"} </span>):filterdData.item.variableMeasured.value}{(filterdData.item.variableMeasured.unitText == 'celsius' && filterdData.item.variableMeasured.name != 'last-measurement')? <span>&deg;{"C"}</span> :null}
                </p>
              );
            })}
        </div>
      );
    }
  );
};

export default FeedList;